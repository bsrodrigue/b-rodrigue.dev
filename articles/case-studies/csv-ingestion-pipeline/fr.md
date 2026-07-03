---
title: "Étude de cas #1 : Comment j'ai optimisé le throughput de notre pipeline d'ingestion CSV"
date: "2026-07-01"
category: essay
tags:
  - case-study
  - django
  - python
  - coding
  - software design
  - performance
---
# Le Rationale

Dans mon job chez DISCOM, j'avais la responsabilité principale de concevoir et builder une plateforme de collecte et d'analyse de données pour l'industrie cotonnière du Burkina Faso. Notre client (l'AICB) avait l'habitude de distribuer des documents Word et Excel aux différents organismes, qui devaient les remplir manuellement avant de les renvoyer pour synthèse.

Ce processus était lent et sujet aux erreurs. La plateforme que j'allais construire faciliterait la vie de tout le monde. Les agents des différents organismes n'auraient qu'à se connecter et remplir des formulaires numériques centralisés avec suivi de progression et validation, rendant impossible l'oubli de champs, la perte de progression ou la saisie de données invalides. Notre client pourrait ensuite interroger les données sous forme agrégée, les visualiser et générer des rapports pour une meilleure prise de décision.

L'architecture de base est assez simple à comprendre :
- Collecte de données
- Agrégation & Synthèse
- Dashboard de monitoring

J'ai volontairement omis des composants supplémentaires comme l'audit, la configuration, etc., car je voulais me concentrer sur l'une des parties les plus importantes du système : la collecte de données.

La plateforme serait très simple à concevoir et à builder si nous devions seulement créer quelques formulaires à remplir par les différents organismes. Mais cela s'est avéré un peu plus complexe.

Chaque organisme appartient à un type d'organisme, et chaque type d'organisme doit remplir des formulaires différents sans voir ni pouvoir modifier les soumissions des autres parties. L'ensemble des formulaires à remplir par un organisme doit être rempli chaque année pendant des périodes appelées *campagnes*. Nous avons une centaine de formulaires au total, et certains sont plus complexes que d'autres. Certains ne sont que des champs basiques, d'autres nécessitent de sélectionner des données directement liées à des entrées en base de données, et certains ne peuvent même pas être remplis manuellement et nécessitent une ingestion en masse.

J'ai écrit cet article avec la motivation de documenter mes choix de design et les challenges d'ingénierie que j'ai rencontrés.

# Contraintes & Décisions

## Setup Serveur

Nous faisons tourner la plateforme sur un serveur Debian avec les specs suivantes :
- CPU : Intel Core (Haswell, no TSX) à 2.99 GHz et 4 cœurs
- RAM : 8 Go
- Stockage : 74 GiB de HDD

Ce setup est assez modeste, mais l'objectif est de livrer une plateforme de qualité pour un petit nombre d'utilisateurs avec un budget limité. Cela me semble réalisable si nous prenons les bonnes décisions. La ressource la plus rare ici est la RAM, et surtout l'espace de stockage.

## Stack Technologique

- Django
- Redis
- Celery
- Prometheus
- Loki
- Grafana
- PostgreSQL
- Docker

La plateforme n'est pas conçue pour un usage massif à grande échelle, ce n'est pas un réseau social avec des milliers d'interactions par minute. C'est plutôt une plateforme professionnelle conçue pour quelques stakeholders qui l'utiliseront pour collecter des données et générer des statistiques et rapports occasionnellement. Ce qui signifie qu'utiliser React et Django n'est pas un mauvais choix, surtout si on veut tirer parti de la nature dynamique de Django et de la *python magic*.

## Design & Implementation

Avant de plonger dans le design, essayons de visualiser le pattern d'utilisation réel.

Parmi les *organismes*, c'est-à-dire ceux qui rempliront les formulaires, nous avons les sociétés cotonnières : SOFITEX, FASO COTON et SOCOMA.
Chacune pourrait accéder à la plateforme via 10 utilisateurs représentatifs, appelés *agents*.
Nous avons également des organismes spéciaux comme FILSAH, SECOBIO, UNPCB, TRITURATION et INERA, qui pourraient aussi avoir 10 utilisateurs chacun (même s'ils seront moins nombreux en pratique).
Ce qui nous donne une borne supérieure sûre de 80 utilisateurs concurrents côté collecte de données. Côté analytics et administration, on peut raisonnablement supposer au maximum 10 utilisateurs concurrents aussi, mais arrondissons à 20 pour préparer la plateforme à 100 utilisateurs concurrents.

8 Go de RAM et 4 cœurs à environ 3 GHz pour 100 utilisateurs concurrents semble plus que suffisant. La plateforme est fermée par défaut et nécessite une authentification. Du rate limiting peut aussi protéger le serveur.

Concernant le pattern d'utilisation, la grande majorité des utilisateurs seront des agents qui rempliront des formulaires de façon aléatoire. Ils peuvent se connecter tous les jours pour faire des petites progressions, ils peuvent aussi se connecter quelques fois pour saisir beaucoup de données, qui sait. Ils peuvent aussi se connecter pour revoir des données déjà fournies et faire des corrections. C'est aux agents des mêmes organismes de trouver un rythme de travail et une organisation qui leur convient. L'opération la plus lourde sera l'upload et l'ingestion de CSV. Chaque agent de société cotonnière et de SECOBIO uploadera éventuellement de gros fichiers CSV à plusieurs reprises. Ce qui signifie que nous avons une application "write heavy" en termes de quantité pure de données. Sans oublier que les données des campagnes précédentes (avant le développement de la plateforme) devront être importées dans la plateforme, ce qui signifie que la plateforme doit supporter l'import de données d'archive.

### Implementation du Pipeline d'Ingestion CSV

Ce n'était pas l'aspect le plus complexe du système, mais il présentait tout de même des problèmes intéressants. En tant que quelqu'un qui aime raisonner sur la performance, c'était probablement mon challenge technique préféré.

Le besoin d'un pipeline d'ingestion CSV vient du fait que certaines données sont trop nombreuses pour être saisies manuellement. Nous avions besoin d'une interface permettant aux agents d'uploader des fichiers dans un format requis et de les charger dans notre base de données.

Le flow est le suivant :
- L'agent sélectionne un fichier CSV et le soumet au *Granular Form*.
- Le serveur reçoit le fichier et le streame en mémoire.
- Le serveur parse le contenu et valide chaque ligne (simple vérification de type de données).
- Le serveur crée des batches et les soumet pour des bulk upserts dans la base de données.

La plateforme n'a pas besoin d'être un moteur d'ingestion hyper performant capable de traiter des millions de lignes en quelques secondes, mais nous devons tout de même maintenir un throughput raisonnable, surtout avec des langages lents comme Python.

Voici un exemple de mesure d'un de nos premiers processus d'ingestion avec une chunk size de 20 K :

| Métrique                              |                     Valeur |
| ------------------------------------- | -------------------------: |
| Lignes traitées                       |                    16,581  |
| Chunk size                            |                    20,000  |
| Scan CSV                              |                   61.5 ms  |
| Preload des données                   |                  134.9 ms  |
| Parsing                               |                   84.8 ms  |
| Sauvegarde base de données            |               11,071.6 ms  |
| Phase de traitement (sans preload)    |               11,293.6 ms  |
| **Temps total du pipeline**           | **11,490.1 ms (11.49 s)** |

Charger un fichier CSV en mémoire avec presque 17 000 lignes a pris 60 ms. Nous avons aussi fait du prefetching pour rassembler les foreign keys afin d'éviter des DB lookups fréquents. Le parsing du fichier a pris 85 ms. Le plus gros du temps a été passé à charger les données dans la base de données, environ 12 secondes.

Pour mettre les choses en perspective, un parseur C optimisé avec SIMD peut parser 10 Mo de CSV en moins de 5 ms. Le fichier du tableau précédent faisait moins de 1 Mo. Cela montre que malgré la lenteur terrible de Python, le vrai bottleneck reste notre logique base de données. Il est donc clair que nous devons nous concentrer sur la façon dont nous communiquons avec la base de données.

> **Observation**
> C'est une raison convaincante de toujours mesurer avant d'essayer une quelconque optimisation. N'essayez jamais de deviner et de surpasser la machine. Mettez quelques logs ici et là, mesurez et comparez. Vous serez surpris de voir à quel point vous savez peu de choses sur le fonctionnement réel des choses.

Nous utilisons PostgreSQL comme base de données principale. Ce n'est pas une base lente, loin de là, elle est parfaitement capable de traiter des données massives à l'échelle. Nous devons simplement investiguer comment nous l'utilisons réellement.

Parlons d'abord de l'éléphant dans la pièce : les *indexes*.
Ils peuvent considérablement accélérer vos lectures, et ils peuvent aussi anéantir vos performances en écriture s'ils sont mal utilisés. Devrions-nous nous débarrasser des index ? Je dirais qu'il faut les garder et être prudent sur leur utilisation. Pour rappel, la plateforme est à la fois un système de collecte de données et un fournisseur d'analytics. Stocker les données n'est pas le seul problème, nous devons aussi pouvoir interroger rapidement de gros volumes de données sur plusieurs années avec un serveur low budget et une architecture simple.

SOFITEX a aujourd'hui très approximativement 7 K coopératives agricoles et 200 K agriculteurs enregistrés. Un seul enregistrement suit les données par agriculteur, et les autres enregistrements granulaires suivent les données par coopérative et d'autres données qui peuvent multiplier le nombre total de lignes.

Les campagnes peuvent remonter jusqu'en 1950, et notre plateforme doit être suffisamment bonne pour être utilisée à l'avenir. Si on se projette en 2030 : 80 ans × 170 000 lignes = 13 600 000 lignes !

Prenons 20 enregistrements pour les coopératives : 20 × 7 000 × 80 = 11 200 000 lignes ! (Nous avons même omis l'effet multiplicateur de certains enregistrements)

SOFITEX à elle seule pourrait potentiellement prendre plusieurs millions de lignes dans la base de données. Nous pouvons raisonnablement supposer que la plateforme hébergera en production 50 millions de lignes ou plus. Abandonner les *index* reviendrait à se tirer une balle dans le pied. Une solution basée uniquement sur le cache mordrait aussi trop sur notre RAM. Trouvons d'autres solutions.

Qu'en est-il de la latence ? Tous nos services vivent dans des containers sur la même machine cloud. Nous n'utilisons pas non plus d'inserts ligne par ligne, ce qui serait exponentiellement plus lent. Nous utilisons plutôt des bulk upserts fournis par l'ORM Django.

Pourquoi *UPSERT* en particulier ? Commençons par définir ce que c'est. Il n'y a pas de mot-clé spécial en SQL (du moins dans PostgreSQL), c'est comme un *INSERT* classique avec une stratégie de fallback qui consiste à mettre à jour les champs si on déclenche une erreur de *Unique Constraint*. En d'autres termes, quand vous essayez de créer un élément qui existe déjà, vous pouvez choisir de mettre à jour certains champs à la place, et vous pouvez le faire en un seul batch de manière *atomique*.

La syntaxe de base dans PostgreSQL est la suivante :

```sql
INSERT ... ON CONFLICT DO UPDATE
```

Cette feature supporte beaucoup plus de stratégies pour gérer les conflits, mais cette flexibilité n'est pas gratuite. Elle mixe le coût d'un *INSERT* régulier avec un overhead supplémentaire pour la gestion de la résolution des conflits. Si votre payload contient beaucoup de conflits, cela peut être pénalisant. Pouvons-nous concevoir notre application de manière à éviter les données conflictuelles en premier lieu ?

Imaginez qu'un agent d'une société cotonnière uploade un fichier CSV avec des millions de lignes pour la première fois sur la plateforme. Pas de conflits. Maintenant, disons qu'un collègue du même organisme se connecte pour fournir des entrées supplémentaires aux données susmentionnées. Doit-il supprimer tout l'ensemble uploadé ? Ou doit-il pouvoir simplement uploader les nouveaux éléments qu'il souhaite ? Bien sûr, la seconde option est optimale pour une meilleure UX. Considérez aussi la situation où les agents rassemblent de nouvelles données fraîches.
Cela signifie que nous avons besoin d'un moyen de gérer les entrées dupliquées, car les conflits ne peuvent pas être facilement évités. Il s'ensuit donc qu'utiliser des *upserts* est une bonne décision ici et ne devrait pas être optimisé.

Que pouvons-nous regarder d'autre pour extraire plus de performance ? La taille de nos payloads SQL peut-être ?

Même si nous supposons que les données CSV brutes ont une petite taille en octets, il ne faut pas oublier que ces données doivent être formatées et envoyées avec la déclaration SQL. Ce mix peut augmenter considérablement la taille du payload final envoyé à la base de données pour être parsé.
Dans un environnement où la bande passante est limitée, cela peut entraîner une latence supplémentaire en plus du parsing.

La taille totale du SQL envoyé pour notre précédent jeu de données est de *1 412 910 bytes* → *1.41 Mo*. Pourtant, la taille originale du fichier CSV était d'environ *350 Ko*. Formater nos données brutes en un bulk upsert a multiplié la taille originale par un facteur de *4x*. Et si nous envoyons un fichier CSV de *5 Mo* ? Notre mesure a donné *15 Mo* !

Tout ce SQL doit être parsé, planifié puis exécuté, ce qui ajoute de l'overhead. Un bon point de départ est d'utiliser le *batch_size* avec l'ORM Django pour laisser PostgreSQL passer moins de temps à parser avant d'exécuter les inserts réels.
Voici les résultats pour le même jeu de données avec un *batch_size de 5000* :

| Métrique                              |                    Valeur |
| ------------------------------------- | -----------------------: |
| Batch size                            |                     5000 |
| Lignes traitées                       |                  16,581  |
| Chunk size                            |                  20,000  |
| Scan CSV                              |                 32.3 ms  |
| Preload des données                   |                 69.7 ms  |
| Parsing                               |                143.1 ms  |
| Sauvegarde base de données            |              4 172.5 ms  |
| Phase de traitement (sans preload)    |              4 409.0 ms  |
| **Temps total du pipeline**           | **4 478.7 ms (4.48 s)** |

Nous sommes passés de *11.5 s à 4.5 s*, ce qui est un gain énorme ! Le plus gros jeu de données de 170 K lignes s'est complété en *33 secondes*. Est-ce assez rapide maintenant ? Rappelons que la plateforme est conçue pour 100 utilisateurs concurrents. La plupart d'entre eux rempliront des formulaires, et seulement un quart d'entre eux nécessiteront des uploads CSV. Au minimum, nous aurons environ *25 × 4 = 100* uploads CSV en supposant qu'il n'y a pas d'erreurs et que des ré-uploads auront lieu. Les 170 K lignes mentionnées proviennent d'un jeu de données réel potentiel de la plus grande société cotonnière, ce qui signifie qu'un seul upload CSV ne prendra sûrement pas plus d'une minute. De plus, l'agent peut défiler au-delà de l'upload en cours et s'occuper d'autres formulaires (et uploader d'autres fichiers). La nature asynchrone rend l'attente supportable, d'autant plus qu'ils ont une année entière pour collecter leurs données et remplir nos formulaires.

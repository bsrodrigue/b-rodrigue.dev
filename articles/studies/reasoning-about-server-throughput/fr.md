---
title: "Comment raisonner sur le throughput d'un serveur"
date: "2026-07-03"
category: studies
tags:
  - studies
  - performance
  - nodejs
---

Comment scaler une plateforme pour supporter 100 utilisateurs concurrents ? Et surtout, qu'est-ce que ça veut dire exactement ?

Penser uniquement en termes d'utilisateurs peut être trompeur car cela cache des aspects importants comme :
- Un seul utilisateur ouvrant une page ou effectuant une seule action peut déclencher de nombreuses requêtes (fan-out).
- Ou l'inverse, de nombreux utilisateurs peuvent rester sur des pages à faible activité qui ne génèrent presque aucune requête.
- Tous les endpoints ne performent pas de la même manière.
- Cela suppose que le pattern d'utilisation de la plateforme est régulier et stable. Dans le monde réel, les serveurs subissent des pics et des périodes de faible trafic.

C'est une raison convaincante de préférer penser en termes de requêtes par seconde, mais même là, beaucoup d'ingénieurs et de rédacteurs techniques n'expliquent jamais ce que cela signifie réellement. Si vous considérez un serveur qui gère 10 K requêtes par seconde, cela signifie-t-il que chaque requête est traitée en moins de 0,1 milliseconde ?

Pour contexte, une requête base de données peut prendre plusieurs millisecondes. Cela signifie-t-il que gérer 10 K requêtes par seconde est en fait impossible ?

Sur leur site web, *Deno* se présente comme plus performant que *Node* pour gérer les requêtes :
- *Deno* : 105 200 requêtes / seconde
- *Node* : 48 700 requêtes / seconde

Cela signifierait que *Deno* traite chaque requête en *0,0095 ms*. C'est un temps irréaliste pour faire du parsing HTTP, du parsing JSON, de la logique métier et des requêtes base de données.

> **Mise à jour importante**
> Après une vérification récente, il semble que le site de *Deno (https://deno.com/)* a mis à jour ses benchmarks avec plus de clarté et de transparence. Mais la leçon que je vais enseigner reste précieuse.

Vous avez peut-être deviné que j'exagère, mais le but est de montrer que les simples chiffres peuvent être trompeurs et empêcher les débutants d'apprendre et de prendre des décisions importantes. Quand on estime la performance réelle d'un serveur, plusieurs composants sont souvent absents des discours, que ce soit pour des raisons marketing, par ignorance authentique ou par manque d'attention.

La performance est le fruit de décisions techniques et de différents composants qui travaillent ensemble en harmonie.
Vous ne pouvez pas raisonner sur la performance sans considérer :
- Votre hardware
- Vos algorithmes
- Votre modèle de concurrence (concurrency model)
- Votre réseau
- Votre workload

Dans mon exemple précédent, il semblait fou de traiter chaque requête en 1/10ème de milliseconde. Mais cela suppose que vous ne pouvez exécuter qu'une seule requête à la fois et que chaque requête effectue un travail utile pendant toute sa durée de vie. Et si vous pouviez exécuter un millier de requêtes à la fois ?

Imaginez que les premières requêtes arrivent et doivent immédiatement attendre une connexion base de données. Pourquoi ne pas servir la requête suivante ? Et ainsi de suite... Tant que vous n'écrivez pas de code qui bloque votre thread, il pourra prendre de nouvelles requêtes et commencer à les traiter.

> **Soyez curieux de vos chiffres** :
> Même si vous n'êtes pas un grand fan de benchmarking et de mesure, je recommande à tout ingénieur logiciel de connaître la latence des appels système importants et des opérations qui ont lieu sur sa machine. Par exemple, je viens de mesurer le temps nécessaire à un appel système *accept()* : **0,002 millisecondes**. Cela signifie que vous pourriez théoriquement appeler cette fonction *500 000* fois en une seule seconde. Bien sûr, cela ne signifie pas que vous pouvez gérer *500 000 requêtes par seconde*.

Mais ce n'est pas possible pour tous les types de serveurs et de workloads, comme je l'ai dit plus tôt, votre modèle de concurrence compte aussi.

Si votre workload est purement CPU-bound, débloquer la *concurrence* sera difficile car vous serez directement limité par le nombre de vos cœurs. Heureusement, la majorité du workload d'internet est IO bound, c'est-à-dire que les serveurs passent plus de temps à attendre que des opérations d'E/S se produisent ou se complètent qu'à réellement calculer. Cela nous permet d'exploiter le modèle *async* pour gérer plusieurs clients concurrentment.

Avec cela à l'esprit, le nombre de throughput devient plus clair, surtout si nous utilisons la *Loi de Little* :

**L=λ.W**

Où :
- L = nombre moyen d'éléments dans le système (concurrence)
- λ = taux d'arrivée (throughput, éléments par unité de temps)
- W = temps moyen dans le système (latence)

Prenons *Deno*, avec un throughput de 100 000 requêtes par seconde. Ils n'ont pas fourni la latence moyenne par requête, ce qui est important. Un serveur qui gère des millions de requêtes par seconde mais met des jours à répondre ne vaut rien.

Supposons donc, par exemple, une latence moyenne de 300 ms (elle pourrait être plus rapide). Si nous convertissons le throughput en requêtes par milliseconde, nous obtenons *100 requêtes par milliseconde*.

En appliquant la formule, cela signifie *L = 100 × 300 = 30 000 requêtes concurrentes*. En d'autres termes, le serveur *Deno* doit être capable de gérer *30 mille* connexions en même temps et les servir en environ *300 millisecondes* pour atteindre un throughput moyen de *100 mille requêtes par seconde*.

C'est beaucoup plus clair que de simplement dire "Notre système supporte 10 000 utilisateurs concurrents" ou "Deno gère 100 000 requêtes par seconde". Mais gardez à l'esprit que ce modèle échoue dès que votre workload se déplace vers des tâches CPU-bound. En fait, il peut même le casser. La raison est due à la façon dont la plupart des runtimes *async* fonctionnent. Sous le capot, ils implémentent une event loop mono-threadée qui peut changer de tâche quand elle rencontre une opération d'E/S. C'est pourquoi elle doit d'abord exécuter le code bloquant et synchrone avant de rendre la main à l'event loop.

### Conclusion

Le but de ce petit article n'était pas de vous apprendre tout ce qu'il faut pour concevoir des serveurs performants, mais plutôt de vous donner des heuristiques et un modèle mental décent pour commencer à raisonner sur la performance des serveurs. Cela vous aidera aussi à comprendre pourquoi certains types de workloads sont difficiles à scaler par rapport à d'autres. Et aussi, la prochaine fois que vous verrez des benchmarks en ligne, vous serez mieux équipé pour les questionner.

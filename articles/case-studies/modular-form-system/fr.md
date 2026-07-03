---
title: "Étude de cas #2 : Comment j'ai conçu un système de formulaires modulaires"
date: "2026-07-01"
category: essay
tags:
  - case-study
  - django
  - python
  - coding
  - software design
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

### Implementation - Système d'Enregistrements Modulaires

J'ai décidé de concevoir la solution autour du concept de *records*.

Un formulaire à remplir est appelé *record*, et il y a trois types de records :
- Le *SingleEntryRecord* : Quelques champs de formulaire à remplir par enregistrement.
- Le *TabularRecord* : Les mêmes champs de formulaire à remplir pour chaque point d'intérêt sélectionné, par exemple, fournir des informations sur chaque type d'outil utilisé dans la production cotonnière.
- Le *GranularRecord* : Une grande quantité de données liées à un élément particulier (agriculteur, groupe d'agriculteurs) qui ne peut pas être remplie manuellement.

Chaque type de record est représenté par une classe de modèle Django dédiée héritant de *BaseRecord*

```python

class BaseRecord(TimestampedModel):
    """
    Base class for all records records.
    Links to a CampaignRecordSubmission.
    """

    submission: models.ForeignKey[
        CampaignRecordSubmission, CampaignRecordSubmission
    ] = models.ForeignKey(
        CampaignRecordSubmission,
        on_delete=models.CASCADE,
        related_name="%(class)s",
        verbose_name="Soumission",
    )
    submission_id: int

    class Meta:
        abstract = True
        ordering = ["pk"]



class SingleEntryRecord(BaseRecord):
    """
    Pattern for forms that contain exactly one set of data per submission.
    Example: Global campaign financial summary.
    """

    RECORD_TYPE = RecordType.SINGLE

    class Meta(BaseRecord.Meta):
        abstract = True
        constraints = [
            models.UniqueConstraint(
                fields=["submission"],
                name="unique_%(class)s_per_submission",
            )
        ]

### The rest goes here...

```

Ce pattern nous permet de créer des models de chaque type de record et d'utiliser la *meta-programmation* pour ajouter dynamiquement du comportement que nous coderions manuellement :

```python

class ConcreteSingleEntryRecord(SingleEntryRecord):
    # Add your regular django fields
    pass

```

Ensuite, nous créons un objet Python qui agit comme un registre dynamique qui expose ces records aux consommateurs :

```python
# This registry item can then be consumed by third parties

 RecordForm(
    id="primary_input_needs",
    label="Expression des besoins primaires en intrants",
    model_class=ExpressionOfPrimaryInputNeedRecord,
    serializer_class=ExpressionOfPrimaryInputNeedSerializer,
    endpoint="/api/records/inputs/primary/",
    record_type=RecordType.GRANULAR,
    linkage_mode=LinkageMode.SCOOP,
    dynamic_options_endpoints={"input_type": "input-types/"},
    idempotency_keys=[
        "cotton_campaign",
        "scoop",
    ],
),
```

L'idée clé est de trouver une manière intelligente et standardisée de créer des enregistrements afin d'éviter la duplication de code. Le registre peut ensuite être consommé par le front-end React pour créer et render les formulaires dynamiquement. Le registre expose la forme de chaque enregistrement, le pattern de remplissage (singular, tabular, granular), l'endpoint à appeler pour les soumettre et les interroger, etc. Cela nous permet d'avoir un système modulaire d'exposition de formulaires qui permet à des tiers, comme les front-ends, de représenter les formulaires comme ils le souhaitent.

Nous avons actuellement environ 100 enregistrements au total. La plupart des enregistrements (80%) sont pour les sociétés cotonnières et une société cotonnière spéciale appelée SECOBIO. Nous avons 24 Granular Records parmi eux.

Ce design fonctionne parfaitement et scale bien. Ajouter un nouveau formulaire équivaut à créer un modèle Django et à l'ajouter au registre. Le front-end le détectera et le rendra, et gérera la validation et la soumission du formulaire. Il est également possible d'introduire de nouveaux types de records.

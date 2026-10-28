# Cahier des charges v1.0 — Plateforme de gestion des chauffeurs et du parc informatique (KAI)

Version 1.0 du 28/10/2026 — soumise à validation

## Page de garde

Ce document remplace la version initiale et intègre les 31 corrections identifiées dans l'analyse experte du cahier initial. Il devient la référence contractuelle du projet après signature.

| Rubrique | Valeur |
| --- | --- |
| Intitulé | Conception et développement d'une plateforme web intégrée de gestion des chauffeurs et du parc informatique : cas de KAI |
| Nature | Projet de fin de Licence 3 — Informatique / Génie logiciel |
| Approche | Prototype autonome sur données fictives, architecture prête pour une intégration future |
| Maîtrise d'ouvrage | KAI — référent métier : \[nom à compléter\] |
| Maîtrise d'œuvre | \[Nom de l'étudiant\], étudiant en Licence 3 |
| Encadrement académique | \[Nom de l'encadreur\], \[établissement\] |
| Technologies | Angular, Java 21 / Spring Boot 3, PostgreSQL 16, API REST, Docker |
| Durée | 16 semaines, 8 sprints de 2 semaines |
| Statut du document | Version 1.0 — soumise à validation |

### Historique des versions

| Version | Date | Auteur | Modifications |
| --- | --- | --- | --- |
| 0.1 | \[date\] | \[Étudiant\] | Version initiale de cadrage |
| 1.0 | 28/10/2026 | \[Étudiant\] | Exigences numérotées et priorisées, matrice des droits, cycles de vie, pièces justificatives, cartes SIM, conformité loi 2008-12, exigences chiffrées, critères d'acceptation, planning par sprints |

### Liste de diffusion

| Destinataire | Rôle | Action attendue |
| --- | --- | --- |
| Référent métier KAI | Maîtrise d'ouvrage | Valider et signer |
| Responsable IT KAI | Expert technique | Avis sur sécurité et intégration |
| Encadreur académique | Encadrement | Valider et signer |
| Étudiant | Maîtrise d'œuvre | Rédiger et tenir à jour |

### Validation

| Partie | Nom | Date | Signature |
| --- | --- | --- | --- |
| KAI |  |  |  |
| Encadreur |  |  |  |
| Étudiant |  |  |  |

Toute modification après signature fait l'objet d'une nouvelle version et d'une ligne dans l'historique.

## 1. Glossaire

| Terme | Définition |
| --- | --- |
| Affectation | Remise datée et tracée d'un équipement à un chauffeur, active jusqu'à sa restitution |
| Restitution | Retour d'un équipement, avec état constaté, qui clôt l'affectation active |
| Intégration (onboarding) | Ensemble des étapes qui rendent un nouveau chauffeur opérationnel |
| Enrôlement | Inscription d'un téléphone dans l'outil de gestion de flotte mobile de KAI |
| Loxea | Outil existant de KAI cité dans le hors-périmètre (rôle exact à confirmer, point ouvert PO-08) |
| MDM | Mobile Device Management : gestion centralisée des téléphones |
| IMEI | Identifiant unique à 15 chiffres d'un téléphone |
| ICCID | Identifiant unique à 19 ou 20 chiffres d'une carte SIM |
| Pièce justificative | Document officiel du chauffeur ou du véhicule, avec date d'expiration |
| MVP | Produit minimum viable : ensemble des exigences de priorité M |
| MoSCoW | Priorisation : M (Must, indispensable), S (Should), C (Could), W (Won't, exclu) |
| CDP | Commission de protection des Données Personnelles du Sénégal |
| RPO / RTO | Perte de données maximale admise / durée maximale de restauration |
| SLA | Délai cible de traitement d'un incident selon sa priorité |
| JWT | Jeton signé qui prouve l'identité et le rôle de l'utilisateur auprès de l'API |

## 2. Présentation et contexte

### 2.1 Objet

Réaliser une application web qui centralise les dossiers des chauffeurs, leurs véhicules et pièces justificatives, le parc informatique (téléphones, cartes SIM, accessoires), les affectations, le suivi de l'intégration, les demandes d'enrôlement et les incidents.

### 2.2 Existant

Les informations d'intégration sont aujourd'hui suivies dans des fichiers et outils distincts, ce qui impose des vérifications manuelles et rend l'historique difficile à reconstituer. Les valeurs ci-dessous sont à recueillir auprès de KAI en semaine 1 ; elles servent de référence pour mesurer l'apport du prototype.

| Donnée de référence | Valeur actuelle |
| --- | --- |
| Chauffeurs actifs | \[à recueillir\] |
| Nouveaux chauffeurs intégrés par mois | \[à recueillir\] |
| Équipements par catégorie (téléphones, SIM, accessoires) | \[à recueillir\] |
| Enrôlements par mois | \[à recueillir\] |
| Incidents matériels par mois | \[à recueillir\] |
| Durée moyenne d'intégration d'un chauffeur | \[à recueillir\] |
| Outils utilisés (Excel, messagerie, Loxea…) | \[à recueillir\] |

### 2.3 Problématique

Comment concevoir une plateforme web sécurisée et conforme à la loi sur les données personnelles qui centralise la gestion des chauffeurs, l'affectation des équipements et le suivi de leur intégration opérationnelle chez KAI ?

## 3. Objectifs

### 3.1 Objectif général

Livrer en 16 semaines un prototype testé, documenté et déployable par Docker, couvrant 100 % des exigences M.

### 3.2 Objectifs mesurables

| ID | Objectif | Indicateur | Cible |
| --- | --- | --- | --- |
| OBJ-01 | Centraliser l'information | Modules du MVP disponibles | 9 modules sur 9 |
| OBJ-02 | Accélérer la recherche | Temps pour retrouver le détenteur d'un équipement | Moins de 30 s |
| OBJ-03 | Fiabiliser le parc | Doubles affectations possibles | 0 |
| OBJ-04 | Tracer les opérations | Opérations sensibles journalisées | 100 % |
| OBJ-05 | Anticiper les échéances | Pièces expirantes signalées 30 jours avant | 100 % |
| OBJ-06 | Garantir la qualité | Couverture de tests de la couche service | 70 % minimum |
| OBJ-07 | Satisfaire les utilisateurs | Note moyenne en recette (échelle 1 à 5) | 4 ou plus |

## 4. Périmètre

### 4.1 Modules du MVP (priorité M)

1. Authentification, utilisateurs et rôles
2. Chauffeurs et pièces justificatives
3. Véhicules
4. Parc informatique : équipements et cartes SIM
5. Affectations et restitutions
6. Suivi de l'intégration (checklist)
7. Demandes d'enrôlement
8. Incidents et interventions
9. Tableau de bord et journal d'audit

### 4.2 Compléments V1 (priorités S et C)

Notifications, bons de remise PDF, import CSV, exports, perte et vol, alertes d'expiration et de garantie, référentiels paramétrables, QR codes, suivi des délais d'incident.

### 4.3 Hors périmètre (priorité W)

- Connexion directe à l'administration de production de KAI ou à Loxea.
- Création automatique de comptes chauffeurs dans les systèmes réels.
- Enrôlement technique effectif d'un téléphone (MDM) depuis la plateforme.
- Intégration à un système externe sans API documentée et autorisation écrite.
- Application mobile native (l'interface est une application web responsive).
- Compte et espace personnel pour les chauffeurs.
- Gestion de la paie, du carburant et de la maintenance mécanique des véhicules.

### 4.4 Contraintes

- Données exclusivement fictives ou anonymisées ; aucune donnée réelle sans déclaration CDP préalable.
- Le prototype ne lit ni ne modifie aucun système de production.
- Logiciels open source ou gratuits uniquement.
- Interface en français ; fuseau Africa/Dakar.

## 5. Acteurs et droits d'accès

### 5.1 Acteurs

| Acteur | Description | Compte |
| --- | --- | --- |
| Administrateur | Gère comptes, rôles, référentiels ; accès complet | Oui |
| Gestionnaire RH / intégration | Constitue les dossiers chauffeurs et suit l'intégration | Oui |
| Technicien IT | Gère le parc, les affectations, les enrôlements et les incidents | Oui |
| Superviseur | Valide les dossiers, suit les indicateurs | Oui |
| Auditeur | Consulte en lecture seule, y compris le journal d'audit | Oui |
| Chauffeur | Personne concernée par les données ; reçoit les équipements | Non (V1) |
| Système | Déclenche alertes, notifications et transitions automatiques | — |

Un compte porte un seul rôle. Les droits sont vérifiés par l'API ; l'interface ne fait que masquer les actions non autorisées.

### 5.2 Matrice des droits

Légende : **G** = gérer (créer, modifier, archiver), **L** = lire, **—** = aucun accès.

| Ressource / action | Admin | Gestionnaire RH | Technicien IT | Superviseur | Auditeur |
| --- | --- | --- | --- | --- | --- |
| Comptes et rôles | G | — | — | — | L |
| Référentiels (catégories, sites, types de pièces, étapes) | G | L | L | L | L |
| Chauffeurs et pièces | G | G | L | L | L |
| Véhicules | G | G | L | L | L |
| Équipements et SIM | G | L | G | L | L |
| Affectations et restitutions | G | L | G | L | L |
| Dossiers d'intégration : saisie | G | G | L | L | L |
| Dossiers d'intégration : validation ou rejet | G | — | — | G | L |
| Enrôlements | G | L | G | L | L |
| Incidents : déclaration | G | G | G | G | — |
| Incidents : traitement et clôture | G | — | G | — | L |
| Tableau de bord | L | L | L | L | L |
| Exports | Oui | Oui | Oui | Oui | — |
| Journal d'audit | L | — | — | — | L |

Le Gestionnaire RH ne valide jamais un dossier qu'il a saisi : la validation relève du Superviseur (séparation des tâches).

## 6. Besoins fonctionnels

### 6.1 Cas d'utilisation principaux

| ID | Cas d'utilisation | Acteur principal | Exigences liées |
| --- | --- | --- | --- |
| CU-01 | Se connecter et gérer sa session | Tous | EF-01 à EF-04 |
| CU-02 | Gérer les comptes utilisateurs | Administrateur | EF-05, EF-06 |
| CU-03 | Créer et compléter un dossier chauffeur | Gestionnaire RH | EF-07 à EF-13 |
| CU-04 | Enregistrer un véhicule | Gestionnaire RH | EF-14, EF-15 |
| CU-05 | Inventorier un équipement ou une SIM | Technicien IT | EF-16 à EF-22 |
| CU-06 | Affecter un équipement à un chauffeur | Technicien IT | EF-23 à EF-25 |
| CU-07 | Enregistrer une restitution | Technicien IT | EF-26, EF-27 |
| CU-08 | Déclarer une perte ou un vol | Technicien IT | EF-28 |
| CU-09 | Suivre et valider un dossier d'intégration | Gestionnaire RH, Superviseur | EF-29 à EF-33 |
| CU-10 | Traiter une demande d'enrôlement | Technicien IT | EF-34 à EF-37 |
| CU-11 | Déclarer et résoudre un incident | Tous / Technicien IT | EF-38 à EF-44 |
| CU-12 | Consulter le tableau de bord | Tous | EF-45 à EF-47 |
| CU-13 | Rechercher, filtrer, exporter | Tous | EF-48 à EF-51 |
| CU-14 | Consulter le journal d'audit | Administrateur, Auditeur | EF-52, EF-53 |
| CU-15 | Paramétrer les référentiels | Administrateur | EF-54 |
| CU-16 | Recevoir des notifications | Tous | EF-55, EF-56 |

### 6.2 Exigences fonctionnelles

**Authentification et utilisateurs**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-01 | Connexion par e-mail et mot de passe ; déconnexion qui révoque le jeton | M |
| EF-02 | Expiration de session après 30 min d'inactivité, avec message explicite | M |
| EF-03 | Mot de passe oublié : lien à usage unique valable 30 min, envoyé par e-mail | S |
| EF-04 | Verrouillage du compte 15 min après 5 échecs consécutifs ; déverrouillage manuel par l'admin | S |
| EF-05 | Création, modification, désactivation et réactivation des comptes ; aucune suppression | M |
| EF-06 | Changement obligatoire du mot de passe à la première connexion | S |

**Chauffeurs et pièces justificatives**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-07 | Créer, consulter, modifier, archiver un dossier chauffeur | M |
| EF-08 | Champs : matricule interne généré, nom, prénom, date de naissance, téléphone (+221), e-mail facultatif, adresse, site, date d'entrée, statut (actif, suspendu, sorti), contact d'urgence | M |
| EF-09 | Détection des doublons sur téléphone, n° de permis et n° de CNI, avec blocage ou confirmation explicite | M |
| EF-10 | Téléverser les pièces : CNI, permis de conduire, carte grise, attestation d'assurance, visite technique, casier judiciaire si exigé par KAI | M |
| EF-11 | Par pièce : type, numéro, date de délivrance, date d'expiration, fichier (PDF, JPG, PNG, 5 Mo max), statut (à vérifier, conforme, rejetée, expirée) | M |
| EF-12 | Passage automatique d'une pièce à « expirée » à sa date d'expiration ; alerte à J-30 et J-7 | S |
| EF-13 | Fiche chauffeur 360° : identité, pièces, véhicule, équipements détenus, dossier d'intégration, enrôlements, incidents, historique | M |

**Véhicules**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-14 | Créer, modifier, archiver un véhicule : immatriculation unique, marque, modèle, type, couleur, année, date de mise en service | M |
| EF-15 | Associer un véhicule à un chauffeur avec dates de début et de fin ; historique conservé | M |

**Parc informatique**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-16 | Créer, modifier un équipement : identifiant interne généré, catégorie, marque, modèle, n° de série, IMEI (téléphones), date et prix d'acquisition, fournisseur, fin de garantie, état physique (neuf, bon, usé, endommagé) | M |
| EF-17 | Statuts : disponible, attribué, en réparation, perdu/volé, retiré (cycle de vie section 7) | M |
| EF-18 | Cartes SIM : numéro, opérateur, ICCID, forfait, statut (disponible, active, suspendue, résiliée), téléphone associé | M |
| EF-19 | Accessoires (chargeur, câble, coque, support véhicule) gérés comme lignes d'une affectation | S |
| EF-20 | Import CSV de l'inventaire : modèle téléchargeable, contrôle ligne par ligne, rapport d'erreurs, import tout ou rien | S |
| EF-21 | Alerte 60 jours avant fin de garantie ; liste des équipements de plus de 3 ans | C |
| EF-22 | Étiquette QR code imprimable par équipement, qui ouvre sa fiche | C |

**Affectations et restitutions**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-23 | Affecter un équipement disponible à un chauffeur actif : date, auteur, état au départ, accessoires, observations | M |
| EF-24 | Refuser l'affectation d'un équipement non disponible ou déjà affecté (message précisant le détenteur) | M |
| EF-25 | Générer un bon de remise PDF numéroté, à signer, puis téléverser la version signée | S |
| EF-26 | Enregistrer une restitution : date, état constaté, accessoires rendus, observations ; bon de restitution PDF | M |
| EF-27 | Restitution « endommagé » ou accessoire manquant : équipement en réparation et incident pré-rempli proposé | S |
| EF-28 | Déclarer une perte ou un vol : date, circonstances, n° de déclaration de police facultatif ; clôture de l'affectation, SIM à suspendre signalée | S |

**Intégration des chauffeurs**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-29 | Créer un dossier d'intégration par chauffeur, généré depuis un modèle de checklist | M |
| EF-30 | Checklist par défaut : identité vérifiée, pièces conformes, véhicule enregistré, téléphone affecté, SIM active, enrôlement terminé, formation suivie, bon de remise signé (liste définitive validée par KAI, PO-03) | M |
| EF-31 | Chaque étape : obligatoire ou non, statut, auteur, date, commentaire ; certaines étapes se cochent automatiquement (ex. : enrôlement terminé) | M |
| EF-32 | Transitions de statut contrôlées ; commentaire obligatoire en cas de renvoi « à corriger » | M |
| EF-33 | Liste des dossiers en attente avec ancienneté dans le statut et étapes restantes | M |

**Enrôlement des téléphones**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-34 | Créer une demande liée à un chauffeur et à un téléphone affecté | M |
| EF-35 | Statuts demandé, en cours, bloqué, terminé, annulé ; motif obligatoire pour bloqué et annulé | M |
| EF-36 | Technicien responsable, dates, résultat, commentaires ; historique complet des statuts | M |
| EF-37 | Une seule demande ouverte par téléphone | M |

**Incidents**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-38 | Déclarer un incident lié à un équipement : catégorie (panne, casse, logiciel, SIM, perte), priorité P1 à P4, description, pièces jointes | M |
| EF-39 | Attribuer à un technicien ; statuts ouvert, en cours, en attente, résolu, fermé | M |
| EF-40 | Interventions horodatées : action, temps passé, pièce remplacée, commentaire | M |
| EF-41 | Résolution obligatoire avant le statut résolu ; réouverture possible sous 7 jours | M |
| EF-42 | Fermeture automatique 7 jours après résolution sans réouverture | S |
| EF-43 | Calcul du délai de traitement et indicateur de dépassement du délai cible (section 12) | C |
| EF-44 | Historique des incidents par équipement et par chauffeur | M |

**Tableau de bord**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-45 | Indicateurs de la section 12, filtrables par période et par site | M |
| EF-46 | Chaque indicateur ouvre la liste détaillée correspondante, dans la limite des droits | M |
| EF-47 | Contenu adapté au rôle (ex. : le technicien voit d'abord ses incidents et enrôlements) | S |

**Recherche, filtres, exports**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-48 | Recherche globale par nom, téléphone, matricule, n° de série, IMEI, ICCID, immatriculation | M |
| EF-49 | Filtres par statut, catégorie, site, responsable, période ; tri par colonne ; pagination | M |
| EF-50 | Export CSV et Excel de toute liste filtrée | S |
| EF-51 | Export PDF de la fiche chauffeur et de la fiche équipement | C |

**Audit, paramétrage, notifications**

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-52 | Journal d'audit : date, utilisateur, action, entité, valeurs avant et après, adresse IP ; connexions réussies et échouées incluses | M |
| EF-53 | Consultation filtrée du journal ; aucune modification ni suppression possible | M |
| EF-54 | Référentiels paramétrables : catégories d'équipement, sites, types de pièces, modèles de checklist, motifs, opérateurs | S |
| EF-55 | Notifications dans l'application : affectation, incident attribué, dossier à valider ou à corriger, pièce expirante, enrôlement bloqué | S |
| EF-56 | Copie des notifications par e-mail, activable par utilisateur | C |

### 6.3 Ergonomie

- Confirmation explicite avant toute action sensible : restitution, archivage, déclaration de perte, changement de rôle.
- Messages de validation à côté du champ concerné, en français clair.
- Fil d'Ariane et menu latéral par module ; listes avec état vide explicite.
- Saisie assistée : listes déroulantes avec recherche, masques de saisie (téléphone, IMEI, immatriculation).

## 7. Cycles de vie et règles de gestion

Toute transition absente des tableaux ci-dessous est refusée par l'API (code 409). Chaque transition enregistre auteur, date, ancien et nouveau statut, et commentaire.

### 7.1 Dossier d'intégration

| De | Vers | Acteur | Condition |
| --- | --- | --- | --- |
| Brouillon | À vérifier | Gestionnaire RH | Champs obligatoires remplis, pièces obligatoires téléversées |
| À vérifier | À corriger | Superviseur | Commentaire obligatoire |
| À corriger | À vérifier | Gestionnaire RH | Corrections effectuées |
| À vérifier | Validé | Superviseur | Pièces obligatoires « conformes » et non expirées |
| Validé | En intégration | Technicien IT | Au moins un téléphone affecté |
| En intégration | Terminé | Système | Toutes les étapes obligatoires validées |
| Tout statut sauf Terminé | Abandonné | Admin ou Superviseur | Motif obligatoire ; équipements à restituer |

### 7.2 Demande d'enrôlement

| De | Vers | Acteur | Condition |
| --- | --- | --- | --- |
| Demandé | En cours | Technicien IT | Technicien responsable désigné |
| En cours | Bloqué | Technicien IT | Motif obligatoire |
| Bloqué | En cours | Technicien IT | Cause levée |
| En cours | Terminé | Technicien IT | Résultat renseigné ; coche l'étape d'intégration liée |
| Demandé, En cours, Bloqué | Annulé | Technicien IT ou Admin | Motif obligatoire |

### 7.3 Incident

| De | Vers | Acteur | Condition |
| --- | --- | --- | --- |
| Ouvert | En cours | Technicien IT | Technicien attribué |
| En cours | En attente | Technicien IT | Motif : pièce, fournisseur ou utilisateur |
| En attente | En cours | Technicien IT | — |
| En cours | Résolu | Technicien IT | Au moins une intervention et une résolution saisies |
| Résolu | En cours | Déclarant ou Technicien | Dans les 7 jours, motif obligatoire |
| Résolu | Fermé | Déclarant ou Système | Confirmation ou 7 jours écoulés |

### 7.4 Équipement

| De | Vers | Déclencheur | Condition |
| --- | --- | --- | --- |
| Disponible | Attribué | Affectation | Chauffeur actif |
| Attribué | Disponible | Restitution « bon état » | — |
| Attribué | En réparation | Restitution « endommagé » ou incident | Incident lié |
| Disponible | En réparation | Incident | Incident lié |
| En réparation | Disponible | Clôture de l'incident | Réparation réussie |
| Attribué ou Disponible | Perdu/volé | Déclaration | Affectation clôturée automatiquement |
| Disponible ou En réparation | Retiré | Technicien IT ou Admin | Motif (obsolète, irréparable) ; aucune affectation active |

Perdu/volé et Retiré sont des états finaux. Une carte SIM suit le même principe : disponible, active, suspendue, résiliée (final).

### 7.5 Règles de gestion

| ID | Règle |
| --- | --- |
| RG-01 | Chaque équipement possède un identifiant interne unique ; n° de série, IMEI et ICCID sont uniques lorsqu'ils existent. |
| RG-02 | Un équipement a au plus une affectation active (contrainte en base). |
| RG-03 | Seul un équipement « disponible » peut être affecté, et seulement à un chauffeur « actif ». |
| RG-04 | Toute affectation, restitution et changement de statut est conservé dans l'historique, sans modification possible après coup. |
| RG-05 | Un chauffeur détient au plus un téléphone professionnel actif, sauf dérogation motivée de l'administrateur. |
| RG-06 | Une carte SIM active est associée à au plus un téléphone, et un téléphone à au plus une SIM active. |
| RG-07 | Une demande d'enrôlement est liée à un chauffeur et à un téléphone qui lui est affecté ; une seule demande ouverte par téléphone. |
| RG-08 | Un dossier ne passe à « Validé » que si toutes les pièces obligatoires sont conformes et non expirées. |
| RG-09 | Un dossier ne passe à « Terminé » que si toutes les étapes obligatoires sont validées. |
| RG-10 | Celui qui saisit un dossier ne peut pas le valider. |
| RG-11 | Un chauffeur ne peut passer à « sorti » qu'après restitution ou déclaration de perte de tous ses équipements. |
| RG-12 | Une restitution « endommagé » place l'équipement en réparation, jamais en disponible. |
| RG-13 | Un incident ne peut être résolu sans intervention et résolution saisies. |
| RG-14 | Les contrôles de droits et de règles sont exécutés par l'API ; l'interface ne fait jamais foi. |
| RG-15 | Les champs obligatoires et formats sont validés côté interface et côté serveur. |
| RG-16 | Aucune suppression physique de données métier : archivage uniquement ; les archives restent consultables. |
| RG-17 | Deux modifications concurrentes d'un même enregistrement : la seconde est refusée (code 409) avec invitation à recharger. |
| RG-18 | Les données d'un chauffeur sorti depuis plus de 5 ans sont anonymisées (durée à confirmer, PO-10). |

## 8. Exigences non fonctionnelles

| ID | Critère | Exigence | Vérification |
| --- | --- | --- | --- |
| ENF-01 | Performance | 95 % des requêtes API en moins de 500 ms ; affichage d'une liste en moins de 2 s, avec 5 000 chauffeurs et 10 000 équipements en base | Test k6 |
| ENF-02 | Capacité | 50 utilisateurs simultanés sans erreur ni dégradation au-delà d'ENF-01 | Test k6 |
| ENF-03 | Pagination | Listes paginées côté serveur : 20 lignes par défaut, 100 maximum | Revue d'API |
| ENF-04 | Disponibilité | 99 % en heures ouvrées (8 h – 18 h) sur l'environnement de démo | Endpoint de santé |
| ENF-05 | Sauvegarde | Sauvegarde quotidienne automatisée ; RPO 24 h ; RTO 4 h ; restauration testée une fois avant la recette | Procédure documentée |
| ENF-06 | Traçabilité | 100 % des créations, modifications, transitions et connexions journalisées | Test d'intégration |
| ENF-07 | Ergonomie | Opérations courantes en 3 clics maximum depuis le menu ; prise en main sans formation en moins de 30 min | Test avec 3 utilisateurs KAI |
| ENF-08 | Accessibilité | WCAG 2.1 niveau AA sur les écrans principaux ; navigation complète au clavier | Lighthouse ≥ 90 |
| ENF-09 | Compatibilité | Chrome, Edge, Firefox (2 dernières versions) ; écrans de 360 à 1 920 px | Tests manuels |
| ENF-10 | Localisation | Français ; fuseau Africa/Dakar ; dates JJ/MM/AAAA ; téléphones au format E.164 (+221) ; montants en FCFA | Tests unitaires |
| ENF-11 | Maintenabilité | 70 % de couverture sur la couche service ; SonarQube sans bug bloquant ni critique ; Checkstyle et ESLint sans erreur | CI |
| ENF-12 | Portabilité | Lancement complet par `docker compose up` en moins de 10 min sur un poste vierge | Test sur poste vierge |
| ENF-13 | Observabilité | Journaux structurés JSON avec identifiant de corrélation ; endpoint `/actuator/health` | Revue |
| ENF-14 | Documentation | 100 % des endpoints décrits dans OpenAPI ; README d'installation à jour | Revue |

## 9. Sécurité et protection des données

### 9.1 Exigences de sécurité

| ID | Exigence |
| --- | --- |
| SEC-01 | Mots de passe hachés en BCrypt (coût ≥ 12) ; 10 caractères minimum avec majuscule, minuscule, chiffre et caractère spécial |
| SEC-02 | Jeton d'accès JWT de 15 min ; jeton de rafraîchissement de 8 h stocké en base, révoqué à la déconnexion et au changement de mot de passe |
| SEC-03 | Contrôle d'accès par rôle sur chaque endpoint, testé pour chaque rôle ; contrôle de propriété sur les ressources (pas d'accès par simple changement d'identifiant) |
| SEC-04 | HTTPS obligatoire hors poste de développement ; en-têtes CSP, HSTS, X-Content-Type-Options ; CORS limité à l'origine du frontend |
| SEC-05 | Protection contre le Top 10 OWASP : requêtes paramétrées (JPA), échappement Angular, validation des entrées, limitation du débit sur `/auth` (10 requêtes par minute et par IP) |
| SEC-06 | Fichiers téléversés : type MIME réel vérifié, 5 Mo maximum, renommés, stockés hors du dossier public, servis uniquement après contrôle des droits |
| SEC-07 | Messages d'erreur sans trace technique ; détail technique uniquement dans les journaux serveur |
| SEC-08 | Aucun mot de passe, jeton ou donnée personnelle sensible dans les journaux |
| SEC-09 | Secrets (clé JWT, mots de passe de base) en variables d'environnement ; fichier `.env` exclu de Git ; `.env.example` fourni |
| SEC-10 | Dépendances analysées (OWASP Dependency-Check, npm audit) : aucune vulnérabilité critique à la livraison |
| SEC-11 | Scan OWASP ZAP avant la recette : aucune alerte de niveau élevé |

### 9.2 Conformité à la loi n° 2008-12 sur les données personnelles

| ID | Exigence |
| --- | --- |
| RGL-01 | Finalité du traitement déclarée : gestion administrative des chauffeurs et des équipements qui leur sont remis |
| RGL-02 | Minimisation : seules les données listées en EF-08 et EF-10 sont collectées ; liste validée par KAI (PO-02) |
| RGL-03 | Registre du traitement rédigé (modèle fourni en livrable) ; déclaration à la CDP par KAI avant toute donnée réelle |
| RGL-04 | Information des chauffeurs sur la collecte et leurs droits d'accès, de rectification et d'opposition |
| RGL-05 | Export de toutes les données d'un chauffeur sur demande (droit d'accès) |
| RGL-06 | Durées de conservation : dossier 5 ans après la sortie puis anonymisation ; journal d'audit 1 an ; pièces rejetées supprimées sous 3 mois (à confirmer, PO-10) |
| RGL-07 | Accès aux pièces d'identité limité aux rôles qui en ont besoin (matrice section 5.2) et journalisé |
| RGL-08 | Prototype et démonstration : données générées (bibliothèque Faker) ; aucune copie de données réelles sur le poste de l'étudiant |
| RGL-09 | Intégration future aux outils de KAI soumise à autorisation écrite, documentation d'API et revue de sécurité |

## 10. Architecture et choix techniques

Architecture trois couches (Angular, API Spring Boot, PostgreSQL), complétée par un stockage de fichiers et un adaptateur qui isole toute intégration future. Le schéma figure dans l'analyse experte (section 6).

| Couche | Technologie | Responsabilité |
| --- | --- | --- |
| Frontend | Angular 18, TypeScript, Angular Material | Écrans, formulaires réactifs, guards par rôle, intercepteur JWT |
| API | Java 21, Spring Boot 3, Spring Web | Endpoints REST, validation, gestion des erreurs RFC 7807 |
| Sécurité | Spring Security, JWT | Authentification, autorisations par rôle |
| Métier | Services Spring | Règles RG-01 à RG-18, transitions de statut |
| Données | Spring Data JPA, Hibernate, PostgreSQL 16 | Persistance, contraintes d'unicité, verrouillage optimiste |
| Migrations | Flyway | Schéma versionné et jeu de données de démo |
| Mapping | MapStruct | Conversion entités ↔ DTO ; aucune entité exposée |
| Fichiers | Volume Docker (V1), interface compatible MinIO/S3 | Pièces, bons de remise, pièces jointes |
| PDF | OpenPDF | Bons de remise et de restitution, fiches |
| Tâches planifiées | Spring Scheduler | Expiration des pièces, fermeture des incidents, alertes |
| Documentation | springdoc-openapi | Swagger UI et contrat OpenAPI |
| Conteneurs | Docker, Docker Compose | Environnements dev, recette, démo |
| CI | GitHub Actions, SonarCloud | Build, tests, qualité à chaque push |

**Organisation du code** — backend par domaine : `auth`, `user`, `driver`, `document`, `vehicle`, `equipment`, `simcard`, `assignment`, `onboarding`, `enrollment`, `incident`, `notification`, `audit`, `dashboard`, `reference`, `integration`, `common`. Frontend : `core` (auth, guards, intercepteurs), `shared` (composants), `features` (un dossier par module), chargement différé par module.

**Environnements** : développement (poste local), recette (Docker sur poste ou serveur de test), démonstration (Docker, données fictives). Branches Git : `main` protégée, `develop`, une branche par fonctionnalité, fusion par pull request.

## 11. Modèle de données

Toutes les tables métier portent `id` (UUID), `created_at`, `created_by`, `updated_at`, `updated_by`, `version` et `archived`.

| Entité | Attributs principaux | Relations |
| --- | --- | --- |
| User | email (unique), nom, mot de passe haché, actif, verrouillé jusqu'à, dernière connexion | N–1 Role |
| Role | code, libellé | 1–N User |
| RefreshToken | jeton haché, expiration, révoqué | N–1 User |
| Site | code, nom, ville | 1–N Driver |
| Driver | matricule (unique), nom, prénom, naissance, téléphone (unique), adresse, date d'entrée, statut | N–1 Site ; 1–N DriverDocument |
| DocumentType | code, libellé, obligatoire, durée de validité | 1–N DriverDocument |
| DriverDocument | numéro, délivrance, expiration, chemin du fichier, statut | N–1 Driver, N–1 DocumentType |
| Vehicle | immatriculation (unique), marque, modèle, type, couleur, année, mise en service | 1–N VehicleAssignment |
| VehicleAssignment | début, fin | N–1 Driver, N–1 Vehicle |
| EquipmentCategory | code, libellé | 1–N Equipment |
| Equipment | code interne (unique), marque, modèle, n° de série (unique), IMEI (unique), acquisition, prix, fournisseur, fin de garantie, état physique, statut | N–1 EquipmentCategory |
| SimCard | numéro (unique), ICCID (unique), opérateur, forfait, statut | N–0..1 Equipment (téléphone) |
| Assignment | n° de bon, date de remise, état au départ, date de restitution, état au retour, bon signé, observations | N–1 Equipment, N–1 Driver |
| AssignmentAccessory | accessoire, remis, rendu | N–1 Assignment |
| OnboardingTemplate / TemplateStep | libellé, ordre, obligatoire, automatique | 1–N |
| OnboardingRecord | statut, dates | 1–1 Driver ; 1–N OnboardingStep |
| OnboardingStep | statut, auteur, date, commentaire | N–1 OnboardingRecord |
| EnrollmentRequest | statut, motif, résultat, dates | N–1 Driver, N–1 Equipment, N–1 User (technicien) |
| Incident | n°, catégorie, priorité, description, statut, résolution, dates | N–1 Equipment, N–0..1 Driver, N–1 User (déclarant, technicien) |
| Intervention | date, action, temps passé, commentaire | N–1 Incident |
| Attachment | nom, type, taille, chemin | N–1 Incident |
| StatusHistory | type d'entité, id, ancien statut, nouveau statut, auteur, date, commentaire | Générique |
| Notification | type, message, lien, lu | N–1 User |
| AuditLog | date, utilisateur, action, entité, id, valeurs avant / après (JSON), IP | Insertion seule |

Contraintes clés : index unique partiel `assignment(equipment_id) WHERE return_date IS NULL` (RG-02) ; index unique partiel sur la SIM active par téléphone (RG-06) ; clés étrangères sans suppression en cascade.

## 12. API REST et tableau de bord

### 12.1 Conventions

- Préfixe `/api/v1` ; JSON ; noms de ressources au pluriel.
- Pagination `?page=0&size=20&sort=lastName,asc` ; réponse avec `content`, `totalElements`, `totalPages`.
- Erreurs au format RFC 7807 : 400 (validation), 401, 403, 404, 409 (conflit de règle ou de version), 422 (transition interdite), 500.
- Transitions par `PATCH /{ressource}/{id}/status` avec `{ "status": "...", "comment": "..." }`.
- Archivage par `PATCH /{ressource}/{id}/archive` ; aucun `DELETE` sur les données métier.

### 12.2 Catalogue des endpoints

| Ressource | Endpoints |
| --- | --- |
| Auth | POST /auth/login, /auth/refresh, /auth/logout, /auth/password/forgot, /auth/password/reset ; PUT /auth/password |
| Users | GET, POST /users ; GET, PUT /users/{id} ; PATCH /users/{id}/active, /users/{id}/unlock |
| Drivers | GET, POST /drivers ; GET, PUT /drivers/{id} ; PATCH /drivers/{id}/status, /archive ; GET /drivers/{id}/overview, /drivers/{id}/export |
| Documents | GET, POST /drivers/{id}/documents ; PATCH /documents/{id}/status ; GET /documents/{id}/file ; GET /documents/expiring?days=30 |
| Vehicles | GET, POST /vehicles ; GET, PUT /vehicles/{id} ; POST /vehicles/{id}/assign-driver |
| Equipment | GET, POST /equipment ; GET, PUT /equipment/{id} ; PATCH /equipment/{id}/status ; POST /equipment/import ; GET /equipment/{id}/history, /equipment/{id}/qrcode |
| SIM | GET, POST /sim-cards ; PUT /sim-cards/{id} ; PATCH /sim-cards/{id}/status, /sim-cards/{id}/link |
| Assignments | GET, POST /assignments ; POST /assignments/{id}/return, /assignments/{id}/loss ; GET /assignments/{id}/receipt ; POST /assignments/{id}/signed-receipt |
| Onboarding | GET, POST /onboarding ; GET /onboarding/{id} ; PATCH /onboarding/{id}/status, /onboarding/{id}/steps/{stepId} |
| Enrollments | GET, POST /enrollments ; GET /enrollments/{id} ; PATCH /enrollments/{id}/status |
| Incidents | GET, POST /incidents ; GET /incidents/{id} ; PATCH /incidents/{id}/status, /incidents/{id}/assign ; POST /incidents/{id}/interventions, /incidents/{id}/attachments |
| Dashboard | GET /dashboard/summary?from=&to=&siteId= |
| Référentiels | GET, POST, PUT /references/{type} (categories, sites, document-types, templates, reasons, operators) |
| Notifications | GET /notifications ; PATCH /notifications/{id}/read, /notifications/read-all |
| Audit | GET /audit-logs?user=&entity=&from=&to= |
| Exports | GET /{ressource}/export?format=csv\|xlsx + filtres de la liste |

### 12.3 Indicateurs du tableau de bord

| KPI | Calcul | Seuil d'alerte |
| --- | --- | --- |
| Chauffeurs actifs | Chauffeurs au statut actif | — |
| Dossiers d'intégration en attente | Par statut, avec ancienneté | Plus de 5 jours dans un statut |
| Délai moyen d'intégration | Moyenne (date Terminé − date de création) | Plus de 10 jours |
| État du parc | Équipements par statut et catégorie | Disponibles < 5 % du parc |
| Taux d'utilisation | Attribués / (total − retirés − perdus) | Hors de 60 % à 95 % |
| Enrôlements en attente ou bloqués | Comptage et ancienneté | Bloqué depuis plus de 48 h |
| Incidents ouverts | Par priorité | Tout P1 ouvert |
| Incidents résolus sur la période | Comptage | — |
| Respect des délais cibles | Incidents résolus dans le délai / résolus | Moins de 80 % |
| Pièces expirant sous 30 jours | Par type | Toute pièce obligatoire |
| Pertes et vols | Sur la période | Toute hausse mensuelle |

### 12.4 Priorités et délais cibles des incidents

| Priorité | Définition | Prise en charge | Résolution |
| --- | --- | --- | --- |
| P1 Bloquant | Chauffeur dans l'impossibilité de travailler | 1 h | 4 h ouvrées |
| P2 Majeur | Fonction importante dégradée, contournement possible | 4 h | 1 jour ouvré |
| P3 Mineur | Gêne limitée | 1 jour | 3 jours ouvrés |
| P4 Demande | Demande d'information ou d'évolution | 2 jours | 5 jours ouvrés |

Valeurs proposées, à confirmer par KAI (PO-11).

## 13. Tests et recette

### 13.1 Stratégie de tests

Les tests sont écrits pendant chaque sprint et exécutés automatiquement par la CI à chaque push ; une fonctionnalité sans test n'est pas considérée comme terminée.

| Niveau | Outils | Périmètre | Seuil |
| --- | --- | --- | --- |
| Unitaires backend | JUnit 5, Mockito | Services, règles RG, transitions | 70 % de couverture de la couche service |
| Unitaires frontend | Jasmine, Karma | Services, guards, validateurs | 50 % de couverture |
| Intégration | Spring Boot Test, Testcontainers | Repositories, contraintes, transactions | Toutes les contraintes d'unicité |
| API | Postman, Newman (CI) | Chaque endpoint × chaque rôle × cas d'erreur | 100 % des endpoints |
| Bout en bout | Playwright | 10 parcours critiques | 100 % réussis |
| Sécurité | OWASP ZAP, Dependency-Check | Application déployée | Aucune alerte élevée |
| Performance | k6 | ENF-01, ENF-02 | Seuils atteints |
| Accessibilité | Lighthouse, axe | Écrans principaux | Score ≥ 90 |
| Recette utilisateur | Cahier de recette | Scénarios métier | Critère global 13.4 |

**Parcours de bout en bout** : connexion et refus d'accès ; création d'un chauffeur avec pièces ; validation d'un dossier ; affectation d'un téléphone et d'une SIM ; tentative de double affectation ; restitution endommagée ; enrôlement terminé qui coche l'étape ; dossier terminé ; incident de la déclaration à la fermeture ; export d'une liste filtrée.

### 13.2 Critères d'acceptation des exigences M

| Exigence | Critère d'acceptation (étant donné / quand / alors) | Test |
| --- | --- | --- |
| EF-01, EF-02 | Identifiants valides → accès au tableau de bord ; invalides → message générique sans préciser le champ ; 30 min sans action → retour à la connexion | API, E2E |
| EF-05 | Un compte désactivé ne peut plus se connecter ; ses actions passées restent visibles | API |
| SEC-03 | Pour chaque endpoint, un rôle non autorisé reçoit 403, même si l'interface est contournée | API (matrice complète) |
| EF-07, EF-08 | Dossier créé avec matricule généré ; champ obligatoire vide ou téléphone mal formé → 400 avec message par champ | Unitaire, API |
| EF-09 | Téléphone ou n° de permis déjà existant → doublon signalé, création bloquée sans confirmation | API |
| EF-10, EF-11 | Fichier de 6 Mo ou .exe renommé en .pdf → refusé ; PDF de 2 Mo → accepté et téléchargeable par un rôle autorisé uniquement | API |
| EF-13 | La fiche 360° affiche pièces, véhicule, équipements, dossier, enrôlements et incidents du chauffeur | E2E |
| EF-14, EF-15 | Immatriculation en double → 409 ; changement de véhicule → ancienne association close et visible dans l'historique | API |
| EF-16, EF-18, RG-01 | N° de série, IMEI ou ICCID en double → 409 | Intégration |
| EF-17, 7.4 | Transition non listée (ex. : Retiré → Disponible) → 422 | Unitaire |
| EF-23, EF-24, RG-02, RG-03 | Équipement déjà affecté ou en réparation → 409 avec détenteur ou statut ; aucune ligne créée ; deux requêtes simultanées → une seule réussit | Intégration, API |
| EF-26, RG-12 | Restitution « bon état » → disponible ; « endommagé » → en réparation | API |
| EF-29 à EF-31 | Dossier créé avec les étapes du modèle ; enrôlement terminé → étape cochée automatiquement | Intégration |
| EF-32, RG-08 à RG-10 | Validation avec pièce expirée → refus ; validation par l'auteur du dossier → refus ; renvoi sans commentaire → 400 ; dernière étape obligatoire validée → statut Terminé | Unitaire, API |
| EF-33 | La liste des dossiers en attente affiche statut, ancienneté et nombre d'étapes restantes | E2E |
| EF-34 à EF-37, RG-07 | Seconde demande ouverte sur le même téléphone → 409 ; « bloqué » sans motif → 400 ; chaque changement visible dans l'historique | API |
| EF-38 à EF-41, RG-13 | Incident créé au statut Ouvert ; passage à Résolu sans intervention → 422 ; réouverture au 8e jour → refus | API |
| EF-44 | L'historique d'un équipement liste tous ses incidents, du plus récent au plus ancien | API |
| EF-45, EF-46 | Chaque indicateur est égal au résultat d'une requête SQL de contrôle sur le jeu de données de démo ; un clic ouvre la liste filtrée correspondante | Intégration, E2E |
| EF-48, EF-49 | Recherche par IMEI partiel ou nom sans accent → résultat pertinent en moins de 2 s sur 10 000 lignes | E2E, k6 |
| EF-52, EF-53 | Chaque modification crée une ligne d'audit avec valeurs avant et après ; aucun endpoint ne permet de la modifier | Intégration |
| RG-11 | Passage d'un chauffeur à « sorti » avec un équipement non restitué → 409 | API |
| RG-16 | Aucun endpoint `DELETE` sur les entités métier ; l'archivage masque l'élément des listes par défaut | Revue d'API |
| RG-17 | Modification avec une version périmée → 409 et message « données modifiées entre-temps » | Intégration |

Les exigences S et C reçoivent leur critère dans le cahier de recette, rédigé au sprint où elles sont développées.

### 13.3 Matrice de traçabilité

Livrée sous forme de tableur : une ligne par exigence (EF, ENF, SEC, RGL, RG), avec cas d'utilisation, écran, endpoint, tests associés, sprint et statut (non commencé, développé, testé, recetté). Elle est mise à jour à chaque fin de sprint et sert de support au PV de recette.

### 13.4 Recette et acceptation

- **Données** : jeu fictif de 200 chauffeurs, 400 équipements, 300 SIM, 100 incidents (script Flyway).
- **Participants** : 2 à 3 utilisateurs KAI (un par rôle si possible), l'encadreur, l'étudiant.
- **Classement des anomalies** : bloquante (fonction principale inutilisable ou donnée corrompue), majeure (fonction dégradée avec contournement), mineure (ergonomie, libellé).
- **Critère global** : 100 % des exigences M validées, au moins 80 % des exigences S, aucune anomalie bloquante, au plus 3 majeures avec contournement documenté.
- **Issue** : PV de recette signé par KAI et l'encadreur, avec réserves éventuelles et délai de levée.

## 14. Méthode, planning et gouvernance

### 14.1 Méthode

- Scrum allégé : 8 sprints de 2 semaines ; backlog et tableau Kanban dans GitHub Projects.
- Chaque sprint : planification (lundi), démonstration à l'encadreur (fin de sprint), rétrospective écrite d'une demi-page.
- **Définition de « terminé »** : code fusionné par pull request, CI verte, tests écrits, endpoint documenté dans OpenAPI, critère d'acceptation vérifié, matrice de traçabilité à jour.
- **Gestion des changements** : toute demande nouvelle est inscrite au backlog avec une priorité MoSCoW ; elle n'entre dans le sprint en cours qu'en remplaçant une exigence de taille équivalente, avec accord de l'encadreur ; toute modification du périmètre donne une nouvelle version de ce document.

### 14.2 Gouvernance

| Instance | Participants | Fréquence | Objet |
| --- | --- | --- | --- |
| Point d'avancement | Étudiant, encadreur | Hebdomadaire, 30 min | Avancement, blocages, priorités |
| Revue de sprint | Étudiant, encadreur, référent KAI si disponible | Toutes les 2 semaines | Démonstration, retours |
| Comité de validation | Étudiant, encadreur, référent KAI | À chaque jalon | Validation formelle signée |

### 14.3 Planning

| Semaines | Sprint | Contenu | Jalon |
| --- | --- | --- | --- |
| 1–2 | S0 Cadrage | Entretiens KAI, données de référence, points ouverts PO-01 à PO-13 | **J1 : cahier des charges v1.0 signé** |
| 3–4 | S1 Conception | Cas d'utilisation, diagrammes de classes, d'états et de séquence, MCD, maquettes Figma, socle Docker + CI | **J2 : dossier de conception et maquettes validés** |
| 5–6 | S2 Socle | Authentification, utilisateurs, rôles, audit, référentiels | — |
| 7–8 | S3 Chauffeurs | Chauffeurs, pièces, véhicules, fiche 360° | — |
| 9–10 | S4 Parc | Équipements, SIM, affectations, restitutions, bons PDF | **J3 : noyau du MVP démontré** |
| 11–12 | S5 Suivi | Intégration, enrôlements, incidents, notifications | — |
| 13 | S6 Pilotage | Tableau de bord, exports, tests de charge, de sécurité et d'accessibilité | Rapport de tests |
| 14 | S7 Recette | Recette KAI, corrections | **J4 : PV de recette signé** |
| 15 | Réserve | Aléas, sinon exigences C | — |
| 16 | Clôture | Finalisation du mémoire et des guides, répétition de soutenance | Livrables finaux |

Le mémoire est rédigé au fil de l'eau : chapitres 1 et 2 après J1, chapitre 3 après J2, chapitre 4 pendant S2 à S6, chapitre 5 après J4.

## 15. Livrables

| # | Livrable | Jalon |
| --- | --- | --- |
| L01 | Cahier des charges v1.0 signé | J1 |
| L02 | Diagrammes UML : cas d'utilisation, classes, états, séquences | J2 |
| L03 | MCD, modèle relationnel, scripts Flyway | J2 |
| L04 | Maquettes des écrans principaux (Figma) | J2 |
| L05 | Code source Angular et Spring Boot sur GitHub, historique propre | Continu |
| L06 | Fichier `docker-compose.yml`, `.env.example`, jeu de données fictif | J3 |
| L07 | Contrat OpenAPI exporté et collection Postman | J3 |
| L08 | Rapports : couverture, SonarQube, OWASP ZAP, k6, Lighthouse | Semaine 13 |
| L09 | Cahier de recette et matrice de traçabilité | J4 |
| L10 | PV de recette signé | J4 |
| L11 | Registre du traitement des données personnelles (modèle CDP) | J4 |
| L12 | Guide d'installation, guide utilisateur par rôle, documentation technique | Semaine 16 |
| L13 | Procédure de sauvegarde et de restauration testée | Semaine 13 |
| L14 | Mémoire de Licence 3 et support de soutenance | Semaine 16 |
| L15 | Vidéo de démonstration de 5 minutes (secours le jour de la soutenance) | Semaine 16 |

## 16. Risques, budget et ressources

### 16.1 Risques

| Risque | Probabilité | Impact | Mesure |
| --- | --- | --- | --- |
| Besoins incomplets ou évolutifs | Élevée | Fort | Points ouverts datés, validation à chaque jalon, gestion des changements |
| Indisponibilité des interlocuteurs KAI | Élevée | Fort | Dates de jalons fixées dès J1 ; validation par e-mail acceptée ; référent unique |
| Périmètre trop large | Élevée | Fort | MoSCoW ; noyau du MVP prioritaire ; semaine de réserve |
| Retard de planning | Moyenne | Fort | Sprints courts, démonstrations régulières, exigences C sacrifiables |
| Mauvaise compréhension des règles métier | Moyenne | Fort | Maquettes et cycles de vie validés par KAI avant développement |
| Montée en compétence Spring Security / Angular | Moyenne | Moyen | Socle sécurisé traité en premier (S2) |
| Incohérence de données | Moyenne | Fort | Contraintes en base, verrouillage optimiste, tests d'intégration |
| Fuite de données personnelles | Faible | Très fort | Données fictives uniquement, secrets hors Git, dépôt privé |
| Absence d'API d'intégration | Élevée | Faible | Prototype autonome ; adaptateur simulé |
| Perte du code ou du poste | Faible | Fort | Push quotidien sur GitHub, sauvegarde externe |
| Panne le jour de la soutenance | Moyenne | Fort | Docker testé sur poste vierge, vidéo de secours |

### 16.2 Budget et ressources

| Poste | Coût | Remarque |
| --- | --- | --- |
| Logiciels et bibliothèques | 0 FCFA | Open source ; offres gratuites GitHub et SonarCloud |
| Poste de développement | Existant | 16 Go de RAM recommandés pour Docker |
| Hébergement de démonstration | 0 à \[montant\] FCFA | Facultatif ; poste local suffisant |
| Charge de travail | Environ 560 h | 16 semaines × 35 h |

### 16.3 Propriété et suites du projet

- La propriété du code et des livrables est fixée par la convention de stage entre l'université, KAI et l'étudiant (PO-12).
- Après la soutenance, le prototype est remis à KAI avec ses sources, sa documentation et sa procédure d'installation ; aucune maintenance n'est due sauf accord écrit.
- Évolutions envisagées (V2) : intégration MDM et Loxea via l'adaptateur, espace chauffeur, application mobile, signature électronique des bons.

## 17. Points ouverts

| ID | Point à valider | Responsable | Échéance |
| --- | --- | --- | --- |
| PO-01 | Titre définitif et attentes académiques | Encadreur | Semaine 1 |
| PO-02 | Données chauffeurs nécessaires et autorisées | KAI | Semaine 1 |
| PO-03 | Checklist définitive des étapes d'intégration | KAI | Semaine 2 |
| PO-04 | Liste des pièces justificatives obligatoires | KAI | Semaine 2 |
| PO-05 | Catégories d'équipements, accessoires et opérateurs SIM | KAI | Semaine 2 |
| PO-06 | Matrice des droits (section 5.2) | KAI + encadreur | Semaine 2 |
| PO-07 | Indicateurs et seuils d'alerte (section 12.3) | KAI | Semaine 2 |
| PO-08 | Rôle exact de Loxea et de l'outil MDM | KAI | Semaine 2 |
| PO-09 | Données de référence de l'existant (section 2.2) | KAI | Semaine 2 |
| PO-10 | Durées de conservation des données | KAI | Semaine 2 |
| PO-11 | Priorités et délais cibles des incidents (section 12.4) | KAI | Semaine 2 |
| PO-12 | Propriété du code et convention de stage | Université + KAI | Semaine 1 |
| PO-13 | Référent KAI unique et calendrier des jalons | KAI | Semaine 1 |

## Annexes

### A. Plan prévisionnel du mémoire

1. Introduction générale : contexte, problématique, objectifs, méthodologie, plan.
2. Chapitre 1 — Présentation de KAI et étude de l'existant.
3. Chapitre 2 — Analyse des besoins : acteurs, exigences, règles, périmètre.
4. Chapitre 3 — Conception : architecture, UML, modèle de données, maquettes, sécurité.
5. Chapitre 4 — Réalisation : environnement, modules, choix d'implémentation, déploiement.
6. Chapitre 5 — Tests et évaluation : stratégie, résultats, recette, limites.
7. Conclusion générale : bilan, apports, perspectives V2.

### B. Écrans à maquetter

Connexion ; tableau de bord ; liste et fiche 360° chauffeur ; formulaire chauffeur avec pièces ; liste et fiche équipement ; affectation et restitution ; dossier d'intégration avec checklist ; enrôlements ; incident avec interventions ; journal d'audit ; administration des comptes et référentiels.

### C. Correspondance avec l'analyse

Les 31 manques relevés par l'analyse experte sont traités dans ce document ; les valeurs proposées (délais, seuils, durées) restent à confirmer via les points ouverts PO-01 à PO-13.

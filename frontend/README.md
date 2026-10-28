# Frontend — Plateforme KAI (chauffeurs & parc informatique)

Application Angular 21 (composants standalone, signals, zoneless) du cahier des charges v1.0.

## Démarrer

```bash
npm install
npm start          # http://localhost:4200, données fictives en mémoire
npm test           # tests unitaires (Vitest)
npm run build      # build de production (appelle le backend réel)
```

Comptes de démonstration (mot de passe `Demo@2026`) : `admin@kai.sn`, `rh@kai.sn`, `tech@kai.sn`, `superviseur@kai.sn`, `auditeur@kai.sn`.

## Organisation par modules

```
src/app/
├── core/                  Transverse, chargé une seule fois
│   ├── auth/              Session, rôles, matrice des droits, guards, intercepteur JWT
│   ├── http/              Erreurs RFC 7807, URL de l'API
│   └── layout/            Shell (menu filtré par rôle), page « accès refusé »
├── shared/                Réutilisable, sans logique métier
│   ├── data/              Pagination, recherche, chargement de listes
│   ├── forms/             Validateurs (+221, IMEI), messages d'erreur
│   └── ui/                Badge, pagination, directive *appIfAllowed
├── features/              Un dossier = un module métier, chargé à la demande
│   ├── auth/              Connexion
│   ├── dashboard/         Indicateurs
│   ├── drivers/           Chauffeurs : liste, fiche 360°, formulaire
│   ├── equipment/         Parc : liste, formulaire
│   └── assignments/       Affectations, restitutions, règles RG-02/03/05/12
├── mock/                  API simulée (données fictives, mêmes règles que le backend)
└── data-access.providers.ts   Racine de composition : choisit mock ou HTTP
```

Chaque module de `features/` suit la même structure :

```
features/<module>/
├── <module>.models.ts     Types, statuts, libellés
├── <module>.routes.ts     Routes du module (lazy loading)
├── data/                  Port abstrait + implémentation HTTP
├── domain/                Règles métier pures (si besoin)
└── pages/                 Écrans
```

## Principes SOLID appliqués

| Principe | Mise en œuvre |
| --- | --- |
| **S** — responsabilité unique | Écrans = affichage ; repositories = accès aux données ; `domain/*.policy.ts` = règles ; `SessionStore` = état de session ; `AuthService` = orchestration |
| **O** — ouvert / fermé | Nouvelle permission = une ligne dans `permissions.ts` ; nouveau module = un dossier + une route, sans modifier les autres |
| **L** — substitution de Liskov | `DriverHttpRepository` et `DriverMemoryRepository` sont interchangeables derrière `DriverRepository` |
| **I** — ségrégation des interfaces | Un port par module (`DriverRepository`, `EquipmentRepository`, `AssignmentRepository`…) plutôt qu'un service géant |
| **D** — inversion des dépendances | Les écrans injectent des abstractions ; seul `data-access.providers.ts` choisit l'implémentation |

## Passer au backend Spring Boot

Mettre `useMockApi: false` dans `src/environments/environment.development.ts`. Les repositories HTTP appellent `/api/v1/...` comme décrit en section 12 du cahier des charges.

## Avancement

| Module | État |
| --- | --- |
| Authentification, rôles, guards | Fait (mock) |
| Tableau de bord | Fait (indicateurs chauffeurs, parc, affectations) |
| Chauffeurs | Fait : liste, filtres, fiche 360°, création, modification, doublons, RG-11 |
| Parc informatique | Fait : liste, filtres, création, modification, unicité série/IMEI |
| Affectations | Fait : affectation, restitution, RG-02, RG-03, RG-05, RG-12 |
| Pièces justificatives, SIM, bons PDF | À faire (sprints 3–4) |
| Intégration, enrôlements, incidents | À faire (sprint 5) |
| Utilisateurs, journal d'audit | À faire (sprint 2) |

# Tests Frontend Dashboard

Ce fichier contient les tests pour les fonctions JavaScript du dashboard de l'interface utilisateur ColorAPI.

## Structure des Tests

```
tests/frontend/
├── dashboard-simple.test.js     # Tests des fonctions dashboard
└── ../setup/
    └── jest.frontend.setup.js   # Configuration Jest pour frontend
```

## Fonctions Testées

### 1. **fetchColors** - 2 tests
- [x] Appel API correct avec paramètres
- [x] Gestion des erreurs réseau

### 2. **getPermissions** - 4 tests  
- [x] Retour "admin" pour permission admin
- [x] Retour "color manager" pour permission gestionnaire
- [x] Retour "visitor" pour permission visiteur
- [x] Retour "none" pour aucune permission reconnue

### 3. **searchInColors** - 7 tests
- [x] Filtrage par nom français
- [x] Filtrage par nom anglais  
- [x] Filtrage couleurs RAL (sans préfixe)
- [x] Filtrage couleurs OTHER (valeur complète)
- [x] Recherche insensible à la casse
- [x] Gestion chaîne de recherche vide
- [x] Retour tableau vide si aucun résultat

### 4. **modifyStock** - 2 tests
- [x] Retour anticipé sans permissions
- [x] Appel API correct avec permissions admin

### 5. **closeModal** - 1 test
- [x] Fermeture modal et nettoyage DOM

### 6. **loadColorsTable** - 2 tests
- [x] Affichage message "aucune couleur" si tableau vide
- [x] Affichage couleurs en format tableau

## Total des Tests Dashboard

**18 tests frontend** couvrant toutes les fonctions principales :
- API calls (fetchColors, modifyStock)
- Logique métier (getPermissions, searchInColors) 
- Manipulation DOM (closeModal, loadColorsTable)

## Exécution des Tests

```bash
# Tests frontend uniquement
npm test -- tests/frontend/

# Tests dashboard spécifiques
npm test -- tests/frontend/dashboard-simple.test.js

# Tous les tests (backend + frontend)
npm test
```

## Configuration

Les tests frontend utilisent :
- **Jest avec JSDOM** pour simuler l'environnement navigateur
- **Mocks** pour localStorage, fetch, console
- **Setup automatique** du DOM avant chaque test
- **Nettoyage automatique** après chaque test

## Couverture

Les tests couvrent :
- [x] Appels API avec authentification
- [x] Gestion des permissions utilisateur
- [x] Filtrage et recherche de données
- [x] Manipulation et nettoyage DOM
- [x] Gestion des erreurs réseau/serveur
- [x] Validation des paramètres d'entrée

## Environnement de Test

- **Environnement**: JSDOM (simulation navigateur)
- **Mocks globaux**: fetch, localStorage, console, alert, confirm
- **DOM simulé**: Éléments HTML nécessaires aux tests
- **Nettoyage**: Automatique entre chaque test
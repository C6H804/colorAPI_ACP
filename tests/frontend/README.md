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
- ☑️ Appel API correct avec paramètres
- ☑️ Gestion des erreurs réseau

### 2. **getPermissions** - 4 tests  
- ☑️ Retour "admin" pour permission admin
- ☑️ Retour "color manager" pour permission gestionnaire
- ☑️ Retour "visitor" pour permission visiteur
- ☑️ Retour "none" pour aucune permission reconnue

### 3. **searchInColors** - 7 tests
- ☑️ Filtrage par nom français
- ☑️ Filtrage par nom anglais  
- ☑️ Filtrage couleurs RAL (sans préfixe)
- ☑️ Filtrage couleurs OTHER (valeur complète)
- ☑️ Recherche insensible à la casse
- ☑️ Gestion chaîne de recherche vide
- ☑️ Retour tableau vide si aucun résultat

### 4. **modifyStock** - 2 tests
- ☑️ Retour anticipé sans permissions
- ☑️ Appel API correct avec permissions admin

### 5. **closeModal** - 1 test
- ☑️ Fermeture modal et nettoyage DOM

### 6. **loadColorsTable** - 2 tests
- ☑️ Affichage message "aucune couleur" si tableau vide
- ☑️ Affichage couleurs en format tableau

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
- ☑️ Appels API avec authentification
- ☑️ Gestion des permissions utilisateur
- ☑️ Filtrage et recherche de données
- ☑️ Manipulation et nettoyage DOM
- ☑️ Gestion des erreurs réseau/serveur
- ☑️ Validation des paramètres d'entrée

## Environnement de Test

- **Environnement**: JSDOM (simulation navigateur)
- **Mocks globaux**: fetch, localStorage, console, alert, confirm
- **DOM simulé**: Éléments HTML nécessaires aux tests
- **Nettoyage**: Automatique entre chaque test
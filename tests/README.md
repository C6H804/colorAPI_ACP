# Tests pour ColorAPI

## Configuration

Les tests utilisent **Jest**, **Supertest** (backend) et **JSDOM** (frontend) pour tester l'API, les fonctions utilitaires et le code JavaScript client.

## Structure
```text
tests/
├── unit/                          # Tests unitaires backend
│   ├── hash.test.js               # Tests des fonctions de hachage (Hash, CompareHash)
│   ├── jwt.test.js                # Tests des fonctions JWT (CreateToken, ReadToken)
│   └── schemas.test.js            # Tests des schémas Joi (verifyUser, verifyFilters, verifyColorStock, verifyNewPermissions)
├── integration/                   # Tests d'intégration API
│   ├── api.test.js                # Tests endpoints généraux (/api/health, /api/login)
│   ├── auth.test.js               # Tests authentification (POST /api/login, GET /api/auth)
│   ├── colors.test.js             # Tests routes couleurs (list, modifyStock, addColor, deleteColor)
│   ├── users.test.js              # Tests routes utilisateurs (GET /api/users, POST /api/addUser, POST /api/editUser, POST /api/deleteUser)
│   └── permissions-logs.test.js   # Tests permissions et logs (GET /api/permissions, GET /api/permissions/:id, GET /api/logs)
├── frontend/                      # Tests frontend JavaScript
│   ├── dashboard-simple.test.js   # Tests des fonctions du dashboard (fetchColors, getPermissions, searchInColors, modifyStock, closeModal, loadColorsTable)
│   └── README.md                  # Documentation détaillée des tests frontend
├── fixtures/                      # Données de test réutilisables
│   └── testData.js                # Utilisateurs, couleurs et permissions de test
├── helpers/                       # Utilitaires et mocks de test
│   └── testHelpers.js             # Fonctions d'aide, mocks DB, tokens de test
├── setup/                         # Configuration Jest
│   ├── jest.setup.js              # Setup backend (Node.js, mocks globaux, env variables)
│   └── jest.frontend.setup.js     # Setup frontend (JSDOM, mocks DOM, localStorage)
└── __mocks__/                     # Mocks automatiques Jest
    └── public/                    # Mocks des modules frontend
        └── dist/js/components/
            └── _CreateElement.js  # Mock de la fonction createElement
```

## Commandes disponibles

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch (redémarre automatiquement)
npm run test:watch

# Lancer les tests avec coverage
npm run test:coverage
```



### Tests unitaires
Pour la documentation détaillée des tests frontend, consultez le [README des tests frontend](./frontend/README.md).


| Fonction                      | Nombre de tests | Description                                                                                   |
|-------------------------------|-----------------|-----------------------------------------------------------------------------------------------|
| **Hash()**                    | 2               | Hachage de mot de passe, gestion de mot de passe vide                                         |
| **CompareHash()**             | 3               | Comparaison réussie, mots de passe différents, format de hash invalide                         |
| **CreateToken()**             | 3               | Création de token valide, payload vide, payload complexe                                      |
| **ReadToken()**               | 7               | Décodage, rejet formats invalides, gestion token expiré, mauvaise clé, etc.                   |
| **Token roundtrip**           | 2               | Création + lecture de token, préservation des types array/object                              |
| **verifyUser()**              | 11              | Validation utilisateur, gestion erreurs, champs manquants, formats invalides                  |
| **verifyFilters()**           | 5               | Validation filtres, rejets de valeurs invalides ou vides                                      |
| **verifyColorStock()**        | 7               | Validation stock, valeurs limites, coercition, rejets                                         |
| **verifyNewPermissions()**    | 8               | Validation permissions, formats array, champs manquants, erreurs                              |

### Tests d'intégration (Backend API)

| Route/Endpoint                | Nombre de tests | Description                                                                     |
|-------------------------------|-----------------|---------------------------------------------------------------------------------|
| **POST /api/login**           | 6               | Connexion, rejets identifiants/formats invalides                               |
| **GET /api/auth**             | 6               | Vérification tokens, rejets tokens invalides/expirés                           |
| **POST /api/colors/list**     | 5               | Listing couleurs, filtrage, permissions                                        |
| **POST /api/colors/modifyStock** | 6            | Modification stock, permissions, validations                                    |
| **POST /api/colors/addColor** | 3               | Ajout couleur, permissions admin                                               |
| **POST /api/colors/deleteColor** | 4            | Suppression couleur, permissions admin                                         |
| **GET /api/users**            | 3               | Listing utilisateurs, permissions admin                                        |
| **POST /api/addUser**         | 8               | Création utilisateur, validations, permissions                                 |
| **POST /api/editUser**        | 8               | Modification utilisateur, validations, permissions                             |
| **POST /api/deleteUser**      | 4               | Suppression utilisateur, permissions admin                                     |
| **GET /api/permissions**      | 5               | Listing permissions, restrictions admin                                        |
| **GET /api/permissions/:id**  | 8               | Permissions utilisateur, validations ID                                        |
| **GET /api/logs**             | 7               | Logs système, formats, permissions admin                                       |
| **GET /api/health**           | 1               | Statut API                                                                      |

### Tests Frontend (Dashboard)

| Fonction                      | Nombre de tests | Description                                                                     |
|-------------------------------|-----------------|---------------------------------------------------------------------------------|
| **fetchColors()**             | 2               | Appels API, gestion erreurs réseau                                             |
| **getPermissions()**          | 4               | Logique permissions (admin, color manager, visitor, none)                      |
| **searchInColors()**          | 7               | Filtrage couleurs (noms FR/EN/PT, valeurs RAL/OTHER, casse)                    |
| **modifyStock()**             | 2               | Modification stock, vérification permissions                                    |
| **closeModal()**              | 1               | Fermeture modal, nettoyage DOM                                                  |
| **loadColorsTable()**         | 2               | Génération tableau HTML, gestion cas vide                                      |

## 🔐 Tests de Sécurité MySQL

### Considérations Importantes

Avec le nouveau système de 14 utilisateurs MySQL spécialisés, les tests d'intégration nécessitent une configuration particulière :

#### Configuration Requise
```bash
# OBLIGATOIRE : Créer les utilisateurs MySQL avant les tests
mysql -u root -p < database/init/users.sql
```

#### Tests Impactés par la Sécurité MySQL

| Type de Test | Impact | Solution |
|--------------|--------|----------|
| **Tests d'intégration API** | ✅ **Fonctionnent** | Utilisent les vraies connexions MySQL sécurisées |
| **Tests unitaires** | ✅ **Non impactés** | Utilisent des mocks, pas de vraie BDD |
| **Tests frontend** | ✅ **Non impactés** | Utilisent JSDOM + mocks, pas de vraie BDD |

#### Points de Vigilance

1. **🚨 Base de données requise** : Les tests d'intégration ont besoin d'une vraie base de données avec les 14 utilisateurs MySQL
2. **🔐 Permissions réelles** : Chaque DAO teste sa connexion avec l'utilisateur MySQL approprié
3. **🧪 Isolation** : Les tests nettoient leurs données mais préservent les utilisateurs MySQL
4. **⚡ Performance** : 14 pools de connexions peuvent ralentir les tests d'intégration

#### Tests de Sécurité Spécifiques

```javascript
// Exemple de test vérifiant les permissions MySQL
describe('Sécurité MySQL', () => {
    test('colorReader ne peut que SELECT sur colors', async () => {
        // Test que colorReader ne peut pas faire INSERT/UPDATE/DELETE
    });
    
    test('userAdder ne peut que INSERT sur users', async () => {
        // Test des limitations de permissions
    });
});
```

### Variables d'Environnement pour Tests

```env
# .env.test (pour les tests d'intégration)
DB_HOST=localhost
DB_NAME=api_acp_test
DB_USER=root  # Pour créer les utilisateurs de test
DB_PASSWORD=your_password
JWT_SECRET=test_secret_key
```

## Résumé Total des Tests

### Backend : **124 tests**
- Tests unitaires : **41 tests** (indépendants de MySQL)
- Tests d'intégration : **83 tests** (nécessitent MySQL + utilisateurs sécurisés)
- Tests d'intégration : **83 tests**

### Frontend : **18 tests**
- Tests fonctions dashboard : **18 tests**

### **TOTAL : 142 tests** ☑️

## Couverture Fonctionnelle

### ☑️ Backend (API)
- **15 endpoints API** complètement testés
- **Authentification JWT** avec tous les cas d'erreur
- **Permissions utilisateur** (admin, color manager, visitor)
- **Validation des données** avec schémas Joi
- **Gestion des erreurs** de base de données et validation
- **Sécurité** (tokens, hachage mots de passe)

### ☑️ Frontend (Interface)
- **Appels API** avec authentification
- **Logique métier** (permissions, recherche)
- **Manipulation DOM** (modals, tableaux)
- **Gestion erreurs** utilisateur
- **Filtrage et recherche** couleurs
- **Interactions utilisateur** (permissions, stock)

#### Authentification (`/api/login`, `/api/auth`)

- **POST /api/login** : 6 tests  
  Connexion réussie, rejets identifiants invalides/manquants, corps vide
- **GET /api/auth** : 6 tests  
  Vérification token admin/visiteur, rejets token manquant/invalide/expiré

#### Couleurs (`/api/colors/*`)

- **POST /api/colors/list** : 5 tests  
  Retour couleurs admin, filtrage, accès visiteur, rejets non autorisés/token invalide
- **POST /api/colors/modifyStock/:id** : 6 tests  
  Modification stock admin, permissions, rejets ID/valeurs invalides, couleur inexistante
- **POST /api/colors/addColor** : 3 tests  
  Ajout couleur admin, rejets non-admin/champs manquants
- **POST /api/colors/deleteColor/:id** : 4 tests  
  Suppression admin, rejets non-admin/ID invalide/couleur inexistante

#### Utilisateurs (`/api/users`, `/api/addUser`, `/api/editUser`, `/api/deleteUser`)

- **GET /api/users** : 3 tests  
  Retour utilisateurs admin, rejets non-admin/non autorisé
- **POST /api/addUser** : 8 tests  
  Création admin, description par défaut, rejets non-admin/champs invalides/existants
- **POST /api/editUser/:id** : 8 tests  
  Modification admin, changement mot de passe, rejets non-admin/ID/mot de passe invalides
- **POST /api/deleteUser/:id** : 4 tests  
  Suppression admin, rejets non-admin/ID invalide/utilisateur inexistant

#### Permissions & Logs (`/api/permissions`, `/api/logs`)

- **GET /api/permissions** : 5 tests  
  Retour permissions admin, rejets non-admin/modificateur/non autorisé/token invalide
- **GET /api/permissions/:id** : 8 tests  
  Permissions par utilisateur, rejets non-admin/ID invalide/inexistant/string/négatif
- **GET /api/logs** : 7 tests  
  Retour logs admin, rejets non-admin/modificateur/non autorisé/token invalide, format timestamp/user_id

#### API Générales

- **GET /api/health** : 1 test  
  Retour statut API
- **POST /api/login** : 3 tests  
  Connexion valide, rejets identifiants invalides/manquants

---

## Résumé Total

- **Nombre total de fonctions testées** : 11 principales
- **Nombre total de tests** : 124
- **Répartition** :
  - Tests Unitaires : **41** (33%)
  - Tests d'Intégration : **83** (67%)

| Catégorie                | Nombre de tests |
|--------------------------|-----------------|
| Utilitaires Hash         | 5               |
| Utilitaires JWT          | 12              |
| Schémas Joi              | 31              |
| Routes Auth              | 12              |
| Routes Colors            | 18              |
| Routes Users             | 23              |
| Routes Permissions/Logs  | 20              |
| Routes API générales     | 4               |

> Tous ces tests passent avec succès et couvrent l'ensemble de l'API ColorAPI, incluant les fonctionnalités, cas d'erreur et validations de sécurité.

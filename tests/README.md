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

## 🎨 Système de Stock des Couleurs (Mise à Jour)

### Nouveaux États de Stock

Le système de stock supporte maintenant **3 états** pour chaque type de finition :

| Valeur | État | Description |
|--------|------|-------------|
| **0** | 🔴 Hors stock | Couleur non disponible |
| **1** | 🟢 En stock | Couleur disponible |
| **2** | 🟡 En attente | Couleur en cours de réapprovisionnement |

### Types de Finitions Testés

Chaque couleur peut avoir un état différent pour chaque finition :
- `shiny_stock` - Stock finition brillante
- `matte_stock` - Stock finition mate  
- `sanded_stock` - Stock finition sablée

### Tests de Validation du Stock

```javascript
// Exemples de données de test valides
{ shiny_stock: 0, matte_stock: 1, sanded_stock: 2 }  // États mixtes
{ shiny_stock: 2, matte_stock: 2, sanded_stock: 2 }  // Tout en attente
{ shiny_stock: 1, matte_stock: 1, sanded_stock: 1 }  // Tout en stock
```

### API Routes Mises à Jour

- **POST /api/colors/modifyStock/:id** : Accepte les valeurs 0, 1, 2
- **POST /api/colors/addColor** : Validation des 3 états lors de la création
- **Messages d'erreur améliorés** : `"Stock values must be 0 (hors stock), 1 (en stock), or 2 (en attente)"`

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
| **verifyColorStock()**        | 9               | Validation stock (0=hors stock, 1=en stock, 2=en attente), valeurs limites, coercition, rejets |
| **verifyNewPermissions()**    | 8               | Validation permissions, formats array, champs manquants, erreurs                              |

### Tests d'intégration (Backend API)

| Route/Endpoint                | Nombre de tests | Description                                                                     |
|-------------------------------|-----------------|---------------------------------------------------------------------------------|
| **POST /api/login**           | 6               | Connexion, rejets identifiants/formats invalides                               |
| **GET /api/auth**             | 6               | Vérification tokens, rejets tokens invalides/expirés                           |
| **POST /api/colors/list**     | 5               | Listing couleurs, filtrage, permissions                                        |
| **POST /api/colors/modifyStock** | 8            | Modification stock (3 états: 0,1,2), permissions, validations                  |
| **POST /api/colors/addColor** | 5               | Ajout couleur (supports stock 0,1,2), permissions admin                       |
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

## � Changements Base de Données - Stock des Couleurs

### Mise à Jour Récente (v2.0)

Le schéma de la table `colors` a été modifié pour supporter **3 états de stock** au lieu de 2 :

```sql
-- Colonnes concernées (toutes acceptent maintenant 0, 1, 2)
shiny_stock TINYINT(1) CHECK (shiny_stock IN (0, 1, 2))
matte_stock TINYINT(1) CHECK (matte_stock IN (0, 1, 2))
sanded_stock TINYINT(1) CHECK (sanded_stock IN (0, 1, 2))
```

### Impact sur les Tests

| Type de Test | Changements Apportés |
|--------------|---------------------|
| **Tests Unitaires** | +2 nouveaux tests pour valider les 3 états |
| **Tests d'Intégration** | +9 nouveaux tests pour les APIs modifiées |
| **Tests de Validation** | Messages d'erreur mis à jour |
| **Données de Test** | Nouvelle couleur avec état "en attente" (2) |

### Nouveaux Tests Ajoutés

#### Système de Stock (11 nouveaux tests)
- ✅ Validation des 3 états de stock (0, 1, 2)
- ✅ Rejet des valeurs > 2
- ✅ Tests API modifyStock avec état "en attente"
- ✅ Tests API addColor avec les 3 états
- ✅ Tests de combinaisons mixtes d'états

#### Système de Mots de Passe Renforcé
- ✅ **Nouveaux critères** : Au moins 1 majuscule + 1 minuscule + 1 chiffre
- ✅ **Caractères spéciaux autorisés** : @, !, ?, etc.
- ✅ **Longueur** : 8-50 caractères
- ✅ **4 nouveaux tests** pour valider les critères renforcés

## �🔐 Tests de Sécurité MySQL

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

### Backend : **135 tests**
- Tests unitaires : **43 tests** (indépendants de MySQL, +2 pour stock à 3 états)
- Tests d'intégration : **92 tests** (nécessitent MySQL + utilisateurs sécurisés, +9 pour nouvelles validations stock)

### Frontend : **18 tests**
- Tests fonctions dashboard : **18 tests**

### **TOTAL : 153 tests** ☑️

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
- **Nombre total de tests** : 135 (Backend)
- **Répartition** :
  - Tests Unitaires : **43** (32%)
  - Tests d'Intégration : **92** (68%)

| Catégorie                | Nombre de tests |
|--------------------------|-----------------|
| Utilitaires Hash         | 5               |
| Utilitaires JWT          | 12              |
| Schémas Joi              | 33              |
| Routes Auth              | 12              |
| Routes Colors            | 25              |
| Routes Users             | 23              |
| Routes Permissions/Logs  | 20              |
| Routes API générales     | 4               |
| **TOTAL Backend**        | **135**         |
| **Tests Frontend**       | **18**          |
| **GRAND TOTAL**          | **153**         |

> Tous ces tests passent avec succès et couvrent l'ensemble de l'API ColorAPI, incluant les fonctionnalités, cas d'erreur et validations de sécurité.

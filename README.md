# Color API - Système de Gestion des Stocks de Couleurs

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/C6H804/colorAPI_ACP)
[![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-v5.1.0-lightgrey.svg)](https://expressjs.com/)
[![Tests](https://img.shields.io/badge/tests-142%20passed-brightgreen.svg)](#tests-et-qualité)
[![License](https://img.shields.io/badge/license-ISC-orange.svg)](LICENSE)

## Description

Color API est une API RESTful complète pour la gestion des stocks de couleurs avec système d'authentification JWT et gestion des permissions utilisateurs. L'application permet de gérer un catalogue de couleurs (RAL, Pantone, etc.) avec suivi de la disponibilité des stocks par finition (brillant, mat, sablée).

### Navigation Rapide
- **[Documentation Base de Données](database/README.md)** - Architecture MySQL
- **[Documentation des Tests](tests/README.md)** - Vue d'ensemble complète des 142 tests
- **[Tests Frontend](tests/frontend/README.md)** - Guide spécialisé des tests JavaScript
- **[Documentation API](http://localhost:3000/api-docs)** - Swagger UI interactif
- **[Schéma Base de Données](database/database_shema.png)** - Diagramme ERD

## Fonctionnalités

### Authentification & Sécurité
- **Authentification JWT** : Système sécurisé avec tokens Bearer
- **Gestion des permissions** : Système de rôles (admin, color manager, visitor)
- **Middleware de sécurité** : Protection des routes sensibles
- **Hachage des mots de passe** : Utilisation de bcrypt
- **Support CORS** : Configuration pour accès cross-domain sécurisé

### Gestion des Couleurs
- **Catalogue complet** : Support RAL, Pantone et autres standards
- **Stocks binaires** : Suivi de disponibilité (0 = indisponible, 1 = disponible)
- **Multi-finitions** : Brillant, Mat, sablée
- **Filtrage avancé** : Recherche par type de stock et nom
- **Suppression logique** : Conservation de l'historique

### Administration des Utilisateurs
- **Gestion complète** : CRUD utilisateurs avec permissions
- **Logging automatique** : Traçabilité des actions
- **Interface d'administration** : Dashboard web intuitif

### Interface Web
- **Dashboard interactif** : Visualisation et gestion des couleurs
- **Responsive design** : Compatible mobile et desktop
- **Interface multilingue** : Support FR/EN/PT

## Architecture

```
colorAPI_ACP/
├── 📁 server/                       # Backend API
│   ├── 📁 config/                 # Configuration base de données
│   ├── 📁 controllers/              # Logique métier
│   ├── 📁 dao/                    # Accès aux données
│   ├── 📁 docs/                     # Documentation Swagger
│   ├── 📁 middlewares/            # Middlewares personnalisés
│   ├── 📁 routes/                   # Définition des routes
│   ├── 📁 schemas/                # Validation des données (Joi)
│   ├── 📁 utils/                    # Utilitaires (JWT, Hash, etc.)
│   └── 📄 app.js                  # Point d'entrée serveur
├── 📁 public/                       # Frontend web
│   ├── 📁 pages/                  # Pages HTML
│   ├── 📁 dist/                     # Fichiers statiques
│   │   ├── 📁 css/                # Fichiers CSS
│   │   ├── 📁 js/                   # Fichiers JavaScript
│   │   └── 📁 img/                # Images
│   └── 📄 index.html                # Page d'accueil
├── 📁 tests/                        # Suite de tests complète (142 tests) → [📋 Documentation](tests/README.md)
│   ├── 📁 unit/                   # Tests unitaires backend (41 tests)
│   ├── 📁 integration/            # Tests API endpoints (83 tests)
│   ├── 📁 frontend/               # Tests JavaScript UI (18 tests) → [🌐 Guide](tests/frontend/README.md)
│   ├── 📁 fixtures/               # Données de test
│   ├── 📁 helpers/                # Utilitaires de test
│   ├── 📁 setup/                  # Configuration Jest
│   └── 📁 __mocks__/              # Mocks automatiques
├── 📁 database/                   # Scripts SQL
└── 📄 package.json                  # Dépendances Node.js
```

### Stack Technique

#### Backend
- **Runtime** : Node.js v18+
- **Framework** : Express.js v5.1.0
- **Base de données** : MySQL2
- **Authentification** : JWT (jsonwebtoken)
- **Sécurité** : bcrypt pour le hachage
- **Cross-Domain** : CORS (optionnel, pour accès externe)
- **Validation** : Joi
- **Documentation** : Swagger UI + OpenAPI 3.0
- **Développement** : Nodemon
- **Tests** : Jest + Supertest

#### Frontend
- **HTML5/CSS3/JavaScript** (Vanilla)
- **Architecture modulaire** : Composants réutilisables
- **Design responsive** : Compatible tous écrans
- **Tests** : Jest + JSDOM

## Installation et Configuration

### Prérequis
- Node.js v18+ 
- MySQL 8.0+
- npm ou yarn

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/C6H804/colorAPI_ACP.git
cd colorAPI_ACP
```

### 2️⃣ Installer les dépendances
```bash
npm install
```

> Les dépendances de développement incluent Jest, Supertest et JSDOM pour les tests automatisés.  

### 3️⃣ Configuration de la base de données
1. **Créer une base de données MySQL**
2. **Exécuter les scripts dans l'ordre** :
   ```bash
   # Structure de base
   mysql -u root -p votre_db < database/initDB.setup.sql
   
   # Données initiales
   mysql -u root -p votre_db < database/insert.setup.sql
   mysql -u root -p votre_db < database/insertColor.setup.sql
   ```

### 4️⃣ Variables d'environnement
Créer un fichier `.env` à la racine :
```env
# Configuration serveur
API_PORT=3000

# Configuration base de données
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=votre_base_de_donnees

# JWT Secret
JWT_SECRET=votre_secret_jwt_très_sécurisé
```

### 5️⃣ Démarrage du serveur
```bash
# Mode développement (avec hot reload)
npm run dev

# Mode production
node server/app.js
```

L'API sera accessible sur : `http://localhost:3000`

### 6️⃣ Vérification de l'installation
```bash
# Lancer les tests pour vérifier que tout fonctionne
npm test

# Résultat attendu : 142 tests passés
# - Backend Tests: 124 passed
# - Frontend Tests: 18 passed
```

## Documentation API

### Documentation Interactive Swagger
La documentation complète de l'API est disponible via Swagger UI :

**[Documentation API Interactive](http://localhost:3000/api-docs)**

### Aperçu des Endpoints

| Catégorie | Nombre | Description |
|-----------|--------|-------------|
| **User** | 2 routes | Authentification et permissions |
| **Color** | 4 routes | Gestion des couleurs et stocks |
| **Admin** | 9 routes | Administration complète |

**Total : 15 endpoints documentés**

### Authentification
1. **Connexion** : `POST /api/login` → Récupérer le token JWT
2. **Utilisation** : Ajouter `Authorization: Bearer <token>` dans les headers
3. **Vérification** : `GET /api/auth` → Vérifier validité et permissions

### Permissions
- **Public** : Connexion
- **Authentifié** : Consultation des couleurs
- **Color Manager** : Modification des stocks
- **Admin** : Accès complet (CRUD couleurs, utilisateurs, logs)

### Accès Cross-Domain (CORS)

L'API peut être configurée pour accepter des requêtes depuis d'autres domaines via CORS :

#### Configuration CORS
```javascript

// dans server/app.js
app.use(cors({
    origin: [
        "172.0.0.1",
        // votre ip / domaine ici
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Utilisation depuis un Autre Site
```javascript
// Exemple d'appel API depuis un domaine externe
const response = await fetch('https://votre-api.com/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user', password: 'pass' })
});

const { token } = await response.json();

// Utiliser le token pour les requêtes suivantes
const colors = await fetch('https://votre-api.com/api/colors/list', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({})
});
```

#### Points Importants
- **CORS requis** : Sans configuration CORS, les navigateurs bloquent les requêtes cross-domain
- **Sécurité** : En production, spécifiez uniquement les domaines autorisés
- **Authentification** : Le système JWT fonctionne normalement avec CORS
- **Documentation** : Swagger UI accessible même avec CORS configuré

## Interface Web

### Pages Disponibles
- **`/`** : Page de connexion
- **`/pages/dashboard.html`** : Tableau de bord principal
- **`/pages/admin.html`** : Interface d'administration
- **`/pages/notFound.html`** : Page 404 personnalisée (est envoyée pour les routes inconnues)

### Fonctionnalités Dashboard
- **Visualisation** : Grille de couleurs avec codes et noms
- **Filtrage** : Par type de stock (brillant, mat, sablée, disponible)
- **Recherche** : Par nom (en 3 langues) ou code RAL
- **Modification** : Changement de disponibilité en temps réel pour ceux qui ont les droits
- **Suppression** : Pour les administrateurs (suppression logique)

## Base de Données

### Schéma de Base de Données

**[Voir le Schéma de Base de Données](database/database_shema.png)**

*Cliquez sur le lien ci-dessus pour consulter le diagramme entité-relation (ERD) complet de la base de données Color API*

### Structure Principale

#### Tables Utilisateurs & Permissions
- **`users`** : Stockage des utilisateurs avec authentification
  - Champs principaux : `id`, `username`, `password_hash`, `last_connexion`
  - Relation : Un utilisateur peut avoir plusieurs permissions
  
- **`permissions`** : Définition des rôles système
  - Rôles disponibles : `admin`, `color_manager`, `visitor`
  - Champs : `id`, `name`, `description`
  
- **`user_permissions`** : Table de liaison Many-to-Many
  - Association entre utilisateurs et permissions
  - Permet la gestion fine des droits d'accès

#### Tables Métier
- **`colors`** : Catalogue principal des couleurs
  - Support multi-standards : RAL, Pantone, etc.
  - Noms multilingues (FR/EN/PT)
  - Stocks binaires par finition (brillant/mat/sablée)
  - Suppression logique avec flag `deleted`
  
- **`logs`** : Traçabilité complète des actions
  - Enregistrement automatique des modifications
  - Horodatage et identification de l'utilisateur
  - Conservation de l'historique pour audit

### Modèle de Données - Couleur
```json
{
  "id": 1,
  "type": "RAL",
  "name_fr": "Rouge feu",
  "name_en": "Fire red", 
  "name_pt": "Vermelho fogo",
  "value": "RAL3000",
  "color": "FF0000",
  "shiny_stock": 1,    // 0 = indisponible, 1 = disponible
  "matte_stock": 0,    // 0 = indisponible, 1 = disponible  
  "sanded_stock": 1,   // 0 = indisponible, 1 = disponible
  "deleted": 0         // 0 = actif, 1 = supprimé logiquement
}
```

### Relations Clés
- **Users ↔ Permissions** : Relation Many-to-Many via `user_permissions`
- **Users → Logs** : Un utilisateur génère plusieurs logs (One-to-Many)
- **Colors → Logs** : Une couleur peut être liée à plusieurs logs (One-to-Many)

### Contraintes et Index
- **Clés primaires** : Auto-incrémentées sur toutes les tables
- **Contraintes d'unicité** : `username` unique, `value` couleur unique par type
- **Index de performance** : Sur les champs de recherche fréquente (`name_*`, `type`, `value`)
- **Contraintes référentielles** : Clés étrangères avec CASCADE sur DELETE/UPDATE

## Tests et Qualité

### Suite de Tests Complète
Une suite de **142 tests automatisés** couvre l'ensemble du projet :

#### **Tests Backend (124 tests)** → [Voir détails](tests/README.md)
- **Tests unitaires** (41 tests) : Fonctions de hachage, JWT, validation Joi
- **Tests d'intégration** (83 tests) : 15 endpoints API avec tous les cas d'usage
- **Couverture complète** : Authentification, permissions, CRUD, gestion d'erreurs

#### **Tests Frontend (18 tests)** → [Guide complet](tests/frontend/README.md)
- **Fonctions JavaScript** : API calls, logique métier, manipulation DOM
- **Environnement JSDOM** : Simulation navigateur pour tests complets
- **Dashboard functions** : Recherche, filtrage, gestion des permissions

#### **Couverture Fonctionnelle**
- **15 endpoints API** complètement testés
- **Authentification JWT** avec tous les cas d'erreur
- **Système de permissions** (admin, color manager, visitor)
- **Validation des données** avec schémas Joi
- **Interface utilisateur** (appels API, DOM, interactions)

### Scripts Disponibles
```bash
# Développement avec hot reload
npm run dev

# Tests complets (backend + frontend)
npm test

# Tests en mode watch (redémarre automatiquement)
npm run test:watch

# Tests avec rapport de couverture
npm run test:coverage

# Tests backend uniquement
npm test -- tests/unit/ tests/integration/

# Tests frontend uniquement
npm test -- tests/frontend/
```

### Documentation des Tests
- **Tests Complets** : [Documentation principale des tests](tests/README.md)
- **Tests Frontend** : [Guide spécialisé des tests JavaScript](tests/frontend/README.md)
- **Configuration Jest** : Support backend (Node.js) et frontend (JSDOM)

### Outils de Développement
- **Jest** : Framework de tests avec mocking avancé
- **Supertest** : Tests HTTP pour l'API REST
- **JSDOM** : Environnement DOM pour tests frontend
- **Nodemon** : Rechargement automatique en développement
- **Swagger UI** : Documentation interactive de l'API
- **CORS** : Support cross-domain pour intégrations externes

## Contribution

### Standards de Code
- **Naming** : camelCase pour JS, snake_case pour SQL
- **Structure** : Séparation claire Controller/DAO/Routes
- **Documentation** : Swagger pour API, JSDoc pour fonctions
- **Sécurité** : Validation systématique des entrées
- **Tests** : TDD avec Jest, couverture minimale 80%
- **Qualité** : Tests automatisés obligatoires pour chaque PR

### Workflow
1. Fork du projet
2. Branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Développement avec tests** (`npm run test:watch` pendant le développement)
4. **Validation** : S'assurer que tous les tests passent (`npm test`)
5. Commit des changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
6. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
7. Création d'une Pull Request

### Critères de Qualité
- **Tous les tests passent** : `npm test` doit être vert
- **Couverture maintenue** : Nouvelles fonctionnalités testées
- **Documentation mise à jour** : README et Swagger si nécessaire
- **Pas de régression** : Tests existants toujours valides

## Licence et Propriété

Ce projet a été développé dans le cadre d'un stage dans l'entreprise ACPORTAIL.

**Développeur** : Stagiaire développeur junior  
**Contexte** : Projet de stage - Système de gestion des stocks de couleurs  
**Année** : 2025

*Les droits de propriété intellectuelle peuvent appartenir à l'entreprise d'accueil selon les termes du contrat de stage.*

## Support

- **Issues** : [GitHub Issues](https://github.com/C6H804/colorAPI_ACP/issues)
- **Documentation** : [Swagger UI](http://localhost:3000/api-docs)

---

**Développé avec ♥ au sein de l'entreprise ACPORTAIL à Bégaar**

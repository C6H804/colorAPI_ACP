# Color API - Système de Gestion des Stocks de Couleurs

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/C6H804/colorAPI_ACP)
[![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-v5.1.0-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-ISC-orange.svg)](LICENSE)

## Description

Color API est une API RESTful complète pour la gestion des stocks de couleurs avec système d'authentification JWT et gestion des permissions utilisateurs. L'application permet de gérer un catalogue de couleurs (RAL, Pantone, etc.) avec suivi de la disponibilité des stocks par finition (brillant, mat, sablée).

## Fonctionnalités

### Authentification & Sécurité
- **Authentification JWT** : Système sécurisé avec tokens Bearer
- **Gestion des permissions** : Système de rôles (admin, color manager, visitor)
- **Middleware de sécurité** : Protection des routes sensibles
- **Hachage des mots de passe** : Utilisation de bcrypt

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
- **Validation** : Joi
- **Documentation** : Swagger UI + OpenAPI 3.0
- **Développement** : Nodemon

#### Frontend
- **HTML5/CSS3/JavaScript** (Vanilla)
- **Architecture modulaire** : Composants réutilisables
- **Design responsive** : Compatible tous écrans

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

### 3️⃣ Configuration de la base de données
1. Créer une base de données MySQL
2. Exécuter les scripts dans l'ordre :
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
- **Suppression** : Pour les administrateurs

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

## Tests et Développement

### Scripts Disponibles
```bash
# Développement avec hot reload
npm run dev

# Tests (à configurer)
npm test

# Vérification des erreurs
npm run lint
```

### Outils de Développement
- **Nodemon** : Rechargement automatique
- **Swagger UI** : Documentation interactive
- **Postman Collection** : Tests d'API (à générer depuis Swagger)

## Contribution

### Standards de Code
- **Naming** : camelCase pour JS, snake_case pour SQL
- **Structure** : Séparation claire Controller/DAO/Routes
- **Documentation** : Swagger pour API, JSDoc pour fonctions
- **Sécurité** : Validation systématique des entrées

### Workflow
1. Fork du projet
2. Branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit des changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Création d'une Pull Request

## Licence et Propriété

Ce projet a été développé dans le cadre d'un stage dans l'entreprise ACPortail.

**Développeur** : Stagiaire développeur junior  
**Contexte** : Projet de stage - Système de gestion des stocks de couleurs  
**Année** : 2025

*Les droits de propriété intellectuelle peuvent appartenir à l'entreprise d'accueil selon les termes du contrat de stage.*

## Support

- **Issues** : [GitHub Issues](https://github.com/C6H804/colorAPI_ACP/issues)
- **Documentation** : [Swagger UI](http://localhost:3000/api-docs)

---

**Développé avec ♥ au sein de l'entreprise ACPortail à Bégaar**

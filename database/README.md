# Documentation Base de Données - Color API

## Vue d'ensemble

La base de données `api_acp` est conçue pour gérer un système complet de gestion des stocks de couleurs avec authentification utilisateur, permissions granulaires et traçabilité des modifications.

## Architecture

### Schéma de Base de Données

**[Voir le Schéma ERD](database_shema.png)**

*Consultez le diagramme entité-relation pour une vue visuelle complète de l'architecture*

## Tables

### Table `users`

Stockage des utilisateurs avec authentification sécurisée.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    description MEDIUMTEXT,
    deleted BOOLEAN DEFAULT 0,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT | Identifiant unique (clé primaire auto-incrémentée) |
| `username` | VARCHAR(255) | Nom d'utilisateur unique |
| `password` | VARCHAR(255) | Hash bcrypt du mot de passe |
| `description` | MEDIUMTEXT | Description ou notes sur l'utilisateur |
| `deleted` | BOOLEAN | Suppression logique (0 = actif, 1 = supprimé) |
| `creation_date` | TIMESTAMP | Date de création du compte |
| `last_connection` | TIMESTAMP | Dernière connexion (mise à jour automatique) |

#### Données initiales

Un compte administrateur par défaut :
- **Username** : `admin`
- **Password** : `Azertyuiop123` (hash bcrypt stocké)

---

### Table `permissions`

Définition des rôles et permissions du système.

```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description MEDIUMTEXT
);
```

#### Champs

| Champ         | Type         | Description                         |
|---------------|--------------|-------------------------------------|
| `id`          | INT          | Identifiant unique de la permission |
| `name`        | VARCHAR(255) | Nom de la permission/rôle           |
| `description` | MEDIUMTEXT   | Description détaillée du rôle       |

#### Permissions disponibles

| ID | Nom                | Description                                     |
|----|--------------------|-------------------------------------------------|
| 1  | `visitor`          | Accès en lecture seule                          |
| 2  | `admin`            | Accès total à toutes les fonctionnalités        |
| 3  | `color manager`    | Modification des stocks de couleurs             |
| 4  | `color log seeker` | Consultation de l'historique des modifications  |

---

### Table `users_permissions`

Table de liaison Many-to-Many entre utilisateurs et permissions.

```sql
CREATE TABLE users_permissions (
    id_user INT NOT NULL,
    id_permission INT DEFAULT 1,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_permission) REFERENCES permissions(id)
);
```

#### Champs

| Champ           | Type | Description                                                  |
|-----------------|------|--------------------------------------------------------------|
| `id_user`       | INT  | Référence à `users.id`                                       |
| `id_permission` | INT  | Référence à `permissions.id` (défaut : 1 = visitor)          |

#### Relations

- **Contrainte de clé étrangère** : CASCADE sur suppression d'utilisateur ou permission
- **Un utilisateur peut avoir plusieurs permissions**
- **Une permission peut être assignée à plusieurs utilisateurs**

---

### Table `colors`

Catalogue principal des couleurs avec gestion des stocks.

```sql
CREATE TABLE colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM("RAL", "OTHER") DEFAULT "RAL",
    value VARCHAR(255),
    color VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    name_pt VARCHAR(255) NOT NULL,
    deleted BOOLEAN DEFAULT 0,
    shiny_stock BOOLEAN DEFAULT 0,
    matte_stock BOOLEAN DEFAULT 0,
    sanded_stock BOOLEAN DEFAULT 0
);
```

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT | Identifiant unique de la couleur |
| `type` | ENUM | Type de référence (`RAL` ou `OTHER`) |
| `value` | VARCHAR(255) | Code de référence (ex: RAL3000, MDR001) |
| `color` | VARCHAR(255) | Code couleur hexadécimal (sans #) |
| `name_en` | VARCHAR(255) | Nom en anglais |
| `name_fr` | VARCHAR(255) | Nom en français |
| `name_pt` | VARCHAR(255) | Nom en portugais |
| `deleted` | BOOLEAN | Suppression logique (0 = actif, 1 = supprimé) |
| `shiny_stock` | BOOLEAN | Disponibilité finition brillante (0/1) |
| `matte_stock` | BOOLEAN | Disponibilité finition mate (0/1) |
| `sanded_stock` | BOOLEAN | Disponibilité finition sablée (0/1) |

#### Types de couleurs

1. **RAL** : Standards RAL (RAL1000 à RAL9023) - 210 couleurs
2. **OTHER** : Couleurs personnalisées (MDR, MDL, MARS, etc.) - 18 couleurs

#### Gestion des stocks

Les stocks sont **binaires** :
- `0` = **Indisponible**
- `1` = **Disponible**

Chaque couleur peut avoir jusqu'à **3 finitions différentes** :
- Brillant (`shiny_stock`)
- Mat (`matte_stock`)
- Sablée (`sanded_stock`)

#### Exemples de données

```json
{
  "id": 45,
  "type": "RAL",
  "value": "RAL3000",
  "name_fr": "Rouge feu",
  "name_en": "Flame red",
  "name_pt": "Vermelho chama",
  "color": "AF2B1E",
  "shiny_stock": 1,
  "matte_stock": 0,
  "sanded_stock": 1,
  "deleted": 0
}
```

---

### Table `colors_changes_types`

Typologie des modifications de couleurs pour la traçabilité.

```sql
CREATE TABLE colors_changes_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description MEDIUMTEXT NOT NULL
);
```

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT | Identifiant unique du type de changement |
| `description` | MEDIUMTEXT | Description du type de modification |

#### Types de modifications

| ID | Description |
|----|-------------|
| 1 | `unknown` |
| 2 | `ajout d'une nouvelle couleur` |
| 3 | `modification des stocks d'une couleur` |
| 4 | `suppression d'une couleur` |

---

### Table `update_colors`

Journal de traçabilité de toutes les modifications de couleurs.

```sql
CREATE TABLE update_colors (
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT NOT NULL,
    id_color INT NOT NULL,
    change_description MEDIUMTEXT,
    id_color_change_types INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_color) REFERENCES colors(id),
    FOREIGN KEY (id_color_change_types) REFERENCES colors_changes_types(id)
);
```

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| `date` | TIMESTAMP | Date et heure de la modification |
| `id_user` | INT | Utilisateur ayant effectué la modification |
| `id_color` | INT | Couleur concernée |
| `change_description` | MEDIUMTEXT | Description détaillée du changement |
| `id_color_change_types` | INT | Type de modification |

#### Relations

- **`id_user`** → `users(id)` : Qui a fait la modification ?
- **`id_color`** → `colors(id)` : Quelle couleur a été modifiée ?
- **`id_color_change_types`** → `colors_changes_types(id)` : Type d'action effectuée

---

## Relations Entre Tables

### Diagramme des Relations

```
┌─────────────┐
│   users     │
├─────────────┤     ┌──────────────────┐
│ id (PK)     │────<│ users_permissions│
│ username    │     ├──────────────────┤
│ password    │     │ id_user (FK)     │
│ ...         │     │ id_permission(FK)│
└─────────────┘     └──────────────────┘
      │                      │
      │                      ↓
      │             ┌────────────────┐
      │             │ permissions    │
      │             ├────────────────┤
      │             │ id (PK)        │
      │             │ name           │
      │             └────────────────┘
      │
      │             ┌─────────────────────┐
      │             │ update_colors       │
      │             ├─────────────────────┤
      └────────────>│ id_user (FK)        │
      ┌────────────>│ id_color (FK)       │
      │             │ id_color_change...  │
      │             └─────────────────────┘
      │                      │
┌─────┴──────┐               │
│   colors   │               │
├────────────┤               │
│ id (PK)    │               ↓
│ type       │     ┌──────────────────────┐
│ value      │     │ colors_changes_types │
│ ...        │     ├──────────────────────┤
└────────────┘     │ id (PK)              │
                   │ description          │
                   └──────────────────────┘
```

### Cardinalités

- **1 User** ↔ **N Permissions** (Many-to-Many via `users_permissions`)
- **1 User** → **N Logs** (One-to-Many dans `update_colors`)
- **1 Color** → **N Logs** (One-to-Many dans `update_colors`)
- **1 Change Type** → **N Logs** (One-to-Many dans `update_colors`)

---

## Configuration MySQL

### Variables d'Environnement

Pour se connecter à la base de données, configurez les variables suivantes dans `.env` :

```env
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=api_acp
```

### Connexion Node.js

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

---

## Installation et Initialisation

### 1. Créer la Base de Données

```bash
# Exécuter le script principal
mysql -u root -p < database/init/db.sql
```

Ce script effectue automatiquement :
1. ✅ Suppression de l'ancienne base (si existante)
2. ✅ Création de la base `api_acp`
3. ✅ Création des 6 tables
4. ✅ Insertion des données initiales :
   - 1 utilisateur admin
   - 4 permissions
   - 4 types de modifications
   - 228 couleurs (210 RAL + 18 OTHER)

### 2. Vérification de l'Installation

```sql
-- Vérifier les tables créées
USE api_acp;
SHOW TABLES;

-- Résultat attendu :
-- colors
-- colors_changes_types
-- permissions
-- update_colors
-- users
-- users_permissions

-- Vérifier le nombre de couleurs
SELECT COUNT(*) FROM colors;
-- Résultat : 228

-- Vérifier l'utilisateur admin
SELECT username, description FROM users WHERE id = 1;
```

---

## Opérations Courantes

### Gestion des Utilisateurs

#### Créer un Nouvel Utilisateur

```sql
-- 1. Créer l'utilisateur
INSERT INTO users (username, password, description) 
VALUES ('nouveau_user', '$2b$12$hash...', 'Description');

-- 2. Assigner des permissions (visitor par défaut)
INSERT INTO users_permissions (id_user, id_permission) 
VALUES (LAST_INSERT_ID(), 1);
```

#### Modifier les Permissions

```sql
-- Ajouter une permission à un utilisateur
INSERT INTO users_permissions (id_user, id_permission) 
VALUES (2, 3); -- User 2 devient color manager

-- Supprimer une permission
DELETE FROM users_permissions 
WHERE id_user = 2 AND id_permission = 3;
```

#### Suppression Logique

```sql
-- Marquer un utilisateur comme supprimé
UPDATE users SET deleted = 1 WHERE id = 5;

-- Restaurer un utilisateur
UPDATE users SET deleted = 0 WHERE id = 5;
```

---

### Gestion des Couleurs

#### Rechercher des Couleurs

```sql
-- Par code RAL
SELECT * FROM colors WHERE value = 'RAL3000';

-- Par nom (multilingue)
SELECT * FROM colors 
WHERE name_fr LIKE '%rouge%' 
   OR name_en LIKE '%red%'
   OR name_pt LIKE '%vermelho%';

-- Couleurs disponibles en brillant
SELECT * FROM colors WHERE shiny_stock = 1 AND deleted = 0;

-- Couleurs complètement indisponibles
SELECT * FROM colors 
WHERE shiny_stock = 0 
  AND matte_stock = 0 
  AND sanded_stock = 0
  AND deleted = 0;
```

#### Modifier les Stocks

```sql
-- Modifier la disponibilité d'une finition
UPDATE colors 
SET matte_stock = 1 
WHERE id = 45;

-- Mettre à jour plusieurs finitions
UPDATE colors 
SET shiny_stock = 1, matte_stock = 1, sanded_stock = 0 
WHERE value = 'RAL3000';
```

#### Ajouter une Nouvelle Couleur

```sql
INSERT INTO colors (
    type, value, color, 
    name_en, name_fr, name_pt,
    shiny_stock, matte_stock, sanded_stock
) VALUES (
    'RAL', 'RAL9999', 'FF00FF',
    'Custom pink', 'Rose personnalisé', 'Rosa personalizado',
    1, 0, 0
);
```

#### Suppression Logique

```sql
-- Supprimer logiquement une couleur
UPDATE colors SET deleted = 1 WHERE id = 100;

-- Lister uniquement les couleurs actives
SELECT * FROM colors WHERE deleted = 0;
```

---

### Consultation des Logs

#### Dernières Modifications

```sql
SELECT 
    uc.date,
    u.username,
    c.value AS color_code,
    c.name_fr,
    cct.description AS change_type,
    uc.change_description
FROM update_colors uc
JOIN users u ON uc.id_user = u.id
JOIN colors c ON uc.id_color = c.id
JOIN colors_changes_types cct ON uc.id_color_change_types = cct.id
ORDER BY uc.date DESC
LIMIT 20;
```

#### Historique d'une Couleur

```sql
SELECT 
    uc.date,
    u.username,
    cct.description AS change_type,
    uc.change_description
FROM update_colors uc
JOIN users u ON uc.id_user = u.id
JOIN colors_changes_types cct ON uc.id_color_change_types = cct.id
WHERE uc.id_color = 45
ORDER BY uc.date DESC;
```

#### Actions d'un Utilisateur

```sql
SELECT 
    uc.date,
    c.value AS color_code,
    cct.description AS change_type,
    uc.change_description
FROM update_colors uc
JOIN colors c ON uc.id_color = c.id
JOIN colors_changes_types cct ON uc.id_color_change_types = cct.id
WHERE uc.id_user = 1
ORDER BY uc.date DESC;
```

---

## Statistiques et Analyses

### Statistiques des Couleurs

```sql
-- Nombre total de couleurs par type
SELECT type, COUNT(*) as total 
FROM colors 
WHERE deleted = 0
GROUP BY type;

-- Disponibilité globale par finition
SELECT 
    SUM(shiny_stock) as disponible_brillant,
    SUM(matte_stock) as disponible_mat,
    SUM(sanded_stock) as disponible_sable,
    COUNT(*) as total_couleurs
FROM colors 
WHERE deleted = 0;

-- Couleurs les plus modifiées
SELECT 
    c.value,
    c.name_fr,
    COUNT(*) as nb_modifications
FROM update_colors uc
JOIN colors c ON uc.id_color = c.id
GROUP BY c.id
ORDER BY nb_modifications DESC
LIMIT 10;
```

### Statistiques des Utilisateurs

```sql
-- Utilisateurs les plus actifs
SELECT 
    u.username,
    COUNT(*) as nb_actions
FROM update_colors uc
JOIN users u ON uc.id_user = u.id
GROUP BY u.id
ORDER BY nb_actions DESC;

-- Distribution des permissions
SELECT 
    p.name,
    COUNT(DISTINCT up.id_user) as nb_users
FROM permissions p
LEFT JOIN users_permissions up ON p.id = up.id_permission
GROUP BY p.id;
```

---

## Bonnes Pratiques

### Sécurité

1. **Hachage des mots de passe** : Toujours utiliser bcrypt (coût 12+)
2. **Suppression logique** : Utiliser le flag `deleted` au lieu de `DELETE`
3. **Validation des entrées** : Valider côté application avant insertion
4. **Permissions minimales** : Accorder uniquement les droits nécessaires

### Performance


 **Requêtes optimisées** :
   - Toujours filtrer les couleurs avec `deleted = 0`
   - Utiliser `LIMIT` pour les grandes listes
   - Éviter `SELECT *` en production

### Maintenance

```sql
-- Nettoyer les anciennes entrées de logs (> 1 an)
DELETE FROM update_colors 
WHERE date < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Archiver les utilisateurs supprimés (> 6 mois)
SELECT * FROM users 
WHERE deleted = 1 
  AND last_connection < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

---

## Sauvegarde et Restauration

### Sauvegarder la Base

```bash
# Sauvegarde complète
mysqldump -u root -p api_acp > backup_api_acp_$(date +%Y%m%d).sql

# Sauvegarde structure uniquement
mysqldump -u root -p --no-data api_acp > structure_api_acp.sql

# Sauvegarde données uniquement
mysqldump -u root -p --no-create-info api_acp > data_api_acp.sql
```

### Restaurer la Base

```bash
# Restauration complète
mysql -u root -p api_acp < backup_api_acp_20250114.sql

# Restauration depuis le script initial
mysql -u root -p < database/init/db.sql
```

---

## Dépannage

### Problèmes Courants

#### Erreur de connexion

```bash
# Vérifier que MySQL est démarré
mysql -u root -p -e "SELECT 1"

# Vérifier les permissions utilisateur
SHOW GRANTS FOR 'votre_user'@'localhost';
```

#### Table n'existe pas

```sql
-- Vérifier la base actuelle
SELECT DATABASE();

-- Lister les tables
SHOW TABLES;

-- Recréer si nécessaire
SOURCE database/init/db.sql;
```

#### Contraintes de clés étrangères

```sql
-- Désactiver temporairement (développement uniquement)
SET FOREIGN_KEY_CHECKS = 0;
-- Effectuer les opérations
SET FOREIGN_KEY_CHECKS = 1;
```

---

## Support et Contribution

Pour toute question ou problème concernant la base de données :

1. **Consulter la documentation** : [README principal](../README.md)
2. **Vérifier le schéma** : [Diagramme ERD](database_shema.png)
3. **Reporter un bug** : [GitHub Issues](https://github.com/C6H804/colorAPI_ACP/issues)

---

**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0.0

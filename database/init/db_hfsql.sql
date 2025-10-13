-- Script adapté pour HFSQL --

-- Créer la base de données et les tables --

DROP DATABASE IF EXISTS api_acp;
CREATE DATABASE API;

USE API;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    description TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_connection DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

DROP TABLE IF EXISTS users_permissions;
CREATE TABLE users_permissions (
    id_user INT NOT NULL,
    id_permission INT DEFAULT 1
);

DROP TABLE IF EXISTS colors;
CREATE TABLE colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type TEXT DEFAULT "RAL",
    value TEXT,
    color TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    name_pt TEXT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    shiny_stock BOOLEAN DEFAULT FALSE,
    matte_stock BOOLEAN DEFAULT FALSE,
    sanded_stock BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS colors_changes_types;
CREATE TABLE colors_changes_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL
);

DROP TABLE IF EXISTS update_colors;
CREATE TABLE update_colors (
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_user INT NOT NULL,
    id_color INT NOT NULL,
    change_description TEXT,
    id_color_change_types INT NOT NULL
);

-- Insertion des couleurs initiales --
DELETE FROM colors;
INSERT INTO colors (type, value, name_en, name_fr, name_pt, color) VALUES 
('RAL', 'RAL1000', 'Green beige', 'Beige vert', 'Bege verde', 'BEBD7F'),
('RAL', 'RAL1001', 'Beige', 'Beige', 'Bege', 'C2B078');

-- Insertion des données initiales --
DELETE FROM users;
INSERT INTO users (username, password, description) VALUES
    ("admin", "$2b$12$hY/JBnKtuBKPaZxvFvcasuWWTmTHOoVqgSSCuRPywQxvHKYn8CEkK", "mot de passe : Azertyuiop123");

DELETE FROM permissions;
INSERT INTO permissions (name, description) VALUES
    ("visitor", "accede uniquement aux données en lecture seule"),
    ("admin", "acces total à tout"),
    ("color manager", "peux modifier les stock d'une couleur"),
    ("color log seeker", "peux voir les logs des modifications de couleurs");

DELETE FROM users_permissions;
INSERT INTO users_permissions (id_user, id_permission) VALUES
    (1, 2);

DELETE FROM colors_changes_types;
INSERT INTO colors_changes_types (description) VALUES
    ("unknown"),
    ("ajout d'une nouvelle couleur"),
    ("modification des stocks d'une couleur"),
    ("suppression d'une couleur");

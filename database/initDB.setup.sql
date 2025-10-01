DROP DATABASE IF EXISTS api_acp;
CREATE DATABASE api_acp;

USE api_acp;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    description MEDIUMTEXT,
    deleted BOOLEAN DEFAULT 0,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description MEDIUMTEXT
);

DROP TABLE IF EXISTS users_permissions;
CREATE TABLE users_permissions (
    id_user INT NOT NULL,
    id_permission INT DEFAULT 1,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_permission) REFERENCES permissions(id)
);



DROP TABLE IF EXISTS colors;
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

DROP TABLE IF EXISTS colors_changes_types;
CREATE TABLE colors_changes_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description MEDIUMTEXT NOT NULL
);

DROP TABLE IF EXISTS update_colors;
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



DELETE FROM users;
INSERT INTO users (username, password, description) VALUES
    ("visitor", "password", "visiteur en lecture seule"),
    ("admin", "$2b$12$hY/JBnKtuBKPaZxvFvcasuWWTmTHOoVqgSSCuRPywQxvHKYn8CEkK", "mot de passe : Azertyui123"),
    ("color_manager", "password", "modifie les stocks");


DELETE FROM permissions;
INSERT INTO permissions (name, description) VALUES
    ("visitor", "accede uniquement aux données en lecture seule"),
    ("admin", "acces total à tout"),
    ("color manager", "peux modifier les stock d'une couleur"),
    ("color log seeker", "peux voir les logs des modifications de couleurs");

DELETE FROM users_permissions;
INSERT INTO users_permissions (id_user, id_permission) VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (3, 3);


DELETE FROM colors_changes_types;
INSERT INTO colors_changes_types (description) VALUES
    ("unknown"),
    ("ajout d'une nouvelle couleur"),
    ("modification des stocks d'une couleur");

-- select * from users_permissions a join users b on a.id_user = b.id join permissions c on a.id_permission = c.id;
select b.username, c.name from users_permissions a join users b on a.id_user = b.id join permissions c on a.id_permission = c.id;
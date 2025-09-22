
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

DELETE FROM colors;
INSERT INTO colors (type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock) VALUES 
    ("RAL", "RAL4008", "800080", "signal purple", "violet de sécurité", "violeta sinal", false, true, false),
    ("RAL", "RAL3020", "FF0000", "traffic red", "rouge signalisation", "vermelho tráfego", true, false, true),
    ("RAL", "RAL5012", "007BA7", "light blue", "bleu clair", "azul claro", true, false, true),
    ("RAL", "RAL2008", "FF8C00", "orange brown", "brun orangé", "castanho laranja", true, true, false),
    ("RAL", "RAL6018", "44D62C", "yellow green", "vert jaune", "verde amarelo", false, true, true),
    ("RAL", "RAL9005", "0A0A0A", "jet black", "noir foncé", "preto intenso", true, false, false),
    ("RAL", "RAL1015", "F3E3C3", "light ivory", "ivoire clair", "marfim claro", false, false, true),
    ("RAL", "RAL7035", "D7D7D7", "light grey", "gris clair", "cinza claro", true, true, false),
    ("RAL", "RAL5002", "20214F", "ultramarine blue", "bleu outremer", "azul ultramarino", false, true, false),
    ("OTHER", "MDR001", "002200", "wood look", "aspect bois", "Aparência de madeira", false, false, true);

-- select * from users_permissions a join users b on a.id_user = b.id join permissions c on a.id_permission = c.id;
select b.username, c.name from users_permissions a join users b on a.id_user = b.id join permissions c on a.id_permission = c.id;
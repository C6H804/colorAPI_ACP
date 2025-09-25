
select * from colors;

select * from colors where name_fr = "vert noir";

UPDATE colors SET color = "343E42" WHERE value = "RAL6012";
UPDATE colors SET name_fr = "vert basque" WHERE value = "RAL6005";



select * from colors;

insert into colors (type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock) VALUES
("RAL", "RAL2650", "", "Brown 650", "Brun 650", "Marrom 650", 0,0,1),
("RAL", "RAL600", "", "Blue 600", "Bleu 600", "Azul 600", 0,0,1),
("RAL", "RAL650", "", "Brown 650", "Brun 650", "Marrom 650", 0,0,1),
("RAL", "RAL700", "", "Blue 700", "Bleu 700", "Azul 700", 0,0,1),
("RAL", "RAL150", "", "Grey 150", "Gris 150", "Cinza 150", 0,0,1),
("RAL", "RAL2800", "", "Grey 2800", "Gris 2800", "Cinza 2800", 0,0,1),
("RAL", "RAL2900", "", "Grey 2900", "Gris 2900", "Ginza 2900", 0,0,1),
("RAL", "RAL400", "", "Grey 400", "Gris 400", "Cinza 400", 0,0,1), -- gris400
("RAL", "RAL900", "", "Grey 900", "Gris 900", "Cinza 900", 0,0,1), -- gris900
-- noir 100
-- noir 200
-- noir 2100
-- noir 2200
-- noir 900
-- rouge 2100
-- noir 2200
-- noir 900
-- rouge 2100
-- vert 2100

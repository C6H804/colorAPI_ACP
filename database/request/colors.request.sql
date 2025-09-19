-- add a color
INSERT INTO colors (type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock) VALUES ("RAL", "RAL 9001", "#FDF5E6", "Cream", "Crème", "Creme", true, true, false);
-- INSERT INTO colors (type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?), [type, value, color, name_en, name_fr, name_pt, shiny_stock, matte_stock, sanded_stock];

-- get color by id
SELECT * FROM colors where id = 1;
-- SELECT * from colors where id = ?, [id];

-- get all colors
SELECT * FROM colors ORDER BY value;
-- filters
SELECT * FROM colors WHERE shiny_stock = true ORDER BY value;
SELECT * FROM colors WHERE matte_stock = true ORDER BY value;
SELECT * FROM colors WHERE sanded_stock = true ORDER BY value;

-- update stock of a color
UPDATE colors SET shiny_stock = false, matte_stock = true, sanded_stock = true WHERE id = 1;
-- UPDATE colors SET shiny_stock = ?, matte_stock = ?, sanded_stock = ? WHERE id = ?, [shiny_stock, matte_stock, sanded_stock, id];

-- log a change of stock of a color
INSERT INTO update_colors (id_user, id_color, change_description, id_color_change_types) VALUES (1, 1, "Changed stock: shiny false, matte true, sanded true", 3);
-- INSERT INTO update_colors (id_user, id_color, change_description, id_color_change_types) VALUES (?, ?, ?, ?), [id_user, id_color, change_description, id_color_change_types];

-- get logs of changes of a color
SELECT * FROM update_colors WHERE id_color = 1 ORDER BY date DESC;
-- créer la base de données et les tables --

DROP DATABASE IF EXISTS API;
CREATE DATABASE API;

USE API;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
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

-- Insertion des couleurs initiales --
DELETE FROM colors;
INSERT INTO colors (type, value, name_en, name_fr, name_pt, color) VALUES 
('RAL', 'RAL1000', 'Green beige', 'Beige vert', 'Bege verde', 'BEBD7F'),
('RAL', 'RAL1001', 'Beige', 'Beige', 'Bege', 'C2B078'),
('RAL', 'RAL1002', 'Sand yellow', 'Jaune sable', 'Amarelo areia', 'C6A664'),
('RAL', 'RAL1003', 'Signal yellow', 'Jaune de sécurité', 'Amarelo sinal', 'E5BE01'),
('RAL', 'RAL1004', 'Golden yellow', 'Jaune or', 'Amarelo ouro', 'CDA434'),
('RAL', 'RAL1005', 'Honey yellow', 'Jaune miel', 'Amarelo mel', 'A98307'),
('RAL', 'RAL1006', 'Maize yellow', 'Jaune maïs', 'Amarelo milho', 'E4A010'),
('RAL', 'RAL1007', 'Daffodil yellow', 'Jaune narcisse', 'Amarelo narciso', 'DC9D00'),
('RAL', 'RAL1011', 'Brown beige', 'Beige brun', 'Bege marrom', '8A6642'),
('RAL', 'RAL1012', 'Lemon yellow', 'Jaune citron', 'Amarelo limão', 'C7B446'),
('RAL', 'RAL1013', 'Oyster white', 'Blanc perlé', 'Branco ostra', 'EAE6CA'),
('RAL', 'RAL1014', 'Ivory', 'Ivoire', 'Marfim', 'E1CC4F'),
('RAL', 'RAL1015', 'Light ivory', 'Ivoire clair', 'Marfim claro', 'E6D690'),
('RAL', 'RAL1016', 'Sulfur yellow', 'Jaune soufre', 'Amarelo enxofre', 'EDFF21'),
('RAL', 'RAL1017', 'Saffron yellow', 'Jaune safran', 'Amarelo açafrão', 'F5D033'),
('RAL', 'RAL1018', 'Zinc yellow', 'Jaune zinc', 'Amarelo zinco', 'F8F32B'),
('RAL', 'RAL1019', 'Grey beige', 'Beige gris', 'Bege acinzentado', '9E9764'),
('RAL', 'RAL1020', 'Olive yellow', 'Jaune olive', 'Amarelo oliva', '999950'),
('RAL', 'RAL1021', 'Rape yellow', 'Jaune colza', 'Amarelo colza', 'F3DA0B'),
('RAL', 'RAL1023', 'Traffic yellow', 'Jaune signalisation', 'Amarelo tráfego', 'FAD201'),
('RAL', 'RAL1024', 'Ochre yellow', 'Jaune ocre', 'Amarelo ocre', 'AEA04B'),
('RAL', 'RAL1026', 'Luminous yellow', 'Jaune brillant', 'Amarelo luminoso', 'FFFF00'),
('RAL', 'RAL1027', 'Curry', 'Jaune curry', 'Amarelo curry', '9D9101'),
('RAL', 'RAL1028', 'Melon yellow', 'Jaune melon', 'Amarelo melão', 'F4A900'),
('RAL', 'RAL1032', 'Broom yellow', 'Jaune genêt', 'Amarelo giesta', 'D6AE01'),
('RAL', 'RAL1033', 'Dahlia yellow', 'Jaune dahlia', 'Amarelo dália', 'F3A505'),
('RAL', 'RAL1034', 'Pastel yellow', 'Jaune pastel', 'Amarelo pastel', 'EFA94A'),
('RAL', 'RAL1035', 'Pearl beige', 'Beige nacré', 'Bege pérola', '6A5D4D'),
('RAL', 'RAL1036', 'Pearl gold', 'Or nacré', 'Ouro pérola', '705335'),
('RAL', 'RAL1037', 'Sun yellow', 'Jaune soleil', 'Amarelo sol', 'F39F18'),
('RAL', 'RAL2000', 'Yellow orange', 'Orangé jaune', 'Laranja amarelado', 'ED760E'),
('RAL', 'RAL2001', 'Red orange', 'Orangé rouge', 'Laranja avermelhado', 'C93C20'),
('RAL', 'RAL2002', 'Vermilion', 'Orangé sang', 'Vermelho', 'CB2821'),
('RAL', 'RAL2003', 'Pastel orange', 'Orangé pastel', 'Laranja pastel', 'FF7514'),
('RAL', 'RAL2004', 'Pure orange', 'Orangé pur', 'Laranja puro', 'F44611'),
('RAL', 'RAL2005', 'Luminous orange', 'Orangé brillant', 'Laranja luminoso', 'FF2301'),
('RAL', 'RAL2007', 'Luminous bright orange', 'Orangé clair brillant', 'Laranja brilhante luminoso', 'FFA420'),
('RAL', 'RAL2008', 'Bright red orange', 'Orangé rouge clair', 'Laranja avermelhado brilhante', 'F75E25'),
('RAL', 'RAL2009', 'Traffic orange', 'Orangé signalisation', 'Laranja tráfego', 'F54021'),
('RAL', 'RAL2010', 'Signal orange', 'Orangé de sécurité', 'Laranja sinal', 'D84B20'),
('RAL', 'RAL2011', 'Deep orange', 'Orangé foncé', 'Laranja profundo', 'EC7C26'),
('RAL', 'RAL2012', 'Salmon range', 'Orangé saumon', 'Laranja salmão', 'E55137'),
('RAL', 'RAL2013', 'Pearl orange', 'Orangé nacré', 'Laranja pérola', 'C35831'),
('RAL', 'RAL2017', 'RAL orange', 'Orange RAL', 'Laranja RAL', 'EA5D1F'),
('RAL', 'RAL3000', 'Flame red', 'Rouge feu', 'Vermelho chama', 'AF2B1E'),
('RAL', 'RAL3001', 'Signal red', 'Rouge de sécurité', 'Vermelho sinal', 'A52019'),
('RAL', 'RAL3002', 'Carmine red', 'Rouge carmin', 'Vermelho carmim', 'A2231D'),
('RAL', 'RAL3003', 'Ruby red', 'Rouge rubis', 'Vermelho rubi', '9B111E'),
('RAL', 'RAL3004', 'Purple red', 'Rouge Basque', 'Vermelho púrpura', '75151E'),
('RAL', 'RAL3005', 'Wine red', 'Rouge vin', 'Vermelho vinho', '5E2129'),
('RAL', 'RAL3007', 'Black red', 'Rouge noir', 'Vermelho preto', '412227'),
('RAL', 'RAL3009', 'Oxide red', 'Rouge oxyde', 'Vermelho óxido', '642424'),
('RAL', 'RAL3011', 'Brown red', 'Rouge brun', 'Vermelho marrom', '781F19'),
('RAL', 'RAL3012', 'Beige red', 'Rouge beige', 'Vermelho bege', 'C1876B'),
('RAL', 'RAL3013', 'Tomato red', 'Rouge tomate', 'Vermelho tomate', 'A12312'),
('RAL', 'RAL3014', 'Antique pink', 'Vieux rose', 'Rosa antigo', 'D36E70'),
('RAL', 'RAL3015', 'Light pink', 'Rose clair', 'Rosa claro', 'EA899A'),
('RAL', 'RAL3016', 'Coral red', 'Rouge corail', 'Vermelho coral', 'B32821'),
('RAL', 'RAL3017', 'Rose', 'Rose', 'Rosa', 'E63244'),
('RAL', 'RAL3018', 'Strawberry red', 'Rouge fraise', 'Vermelho morango', 'D53032'),
('RAL', 'RAL3020', 'Traffic red', 'Rouge signalisation', 'Vermelho tráfego', 'CC0605'),
('RAL', 'RAL3022', 'Salmon pink', 'Rose saumon', 'Rosa salmão', 'D95030'),
('RAL', 'RAL3024', 'Luminous red', 'Rouge brillant', 'Vermelho luminoso', 'F80000'),
('RAL', 'RAL3026', 'Luminous bright red', 'Rouge clair brillant', 'Vermelho brilhante luminoso', 'FE0000'),
('RAL', 'RAL3027', 'Raspberry red', 'Rouge framboise', 'Vermelho framboesa', 'C51D34'),
('RAL', 'RAL3028', 'Pure red', 'Rouge puro', 'Vermelho puro', 'CB3234'),
('RAL', 'RAL3031', 'Orient red', 'Rouge oriental', 'Vermelho oriental', 'B32428'),
('RAL', 'RAL3032', 'Pearl ruby red', 'Rouge rubis nacré', 'Vermelho rubi pérola', '721422'),
('RAL', 'RAL3033', 'Pearl pink', 'Rose nacré', 'Rosa pérola', 'B44C43'),
('RAL', 'RAL4001', 'Red lilac', 'Lilas rouge', 'Lilás avermelhado', '6D3F5B'),
('RAL', 'RAL4002', 'Red violet', 'Violet rouge', 'Violeta avermelhado', '922B3E'),
('RAL', 'RAL4003', 'Heather violet', 'Violet bruyère', 'Violeta urze', 'DE4C8A'),
('RAL', 'RAL4004', 'Claret violet', 'Violet bordeaux', 'Violeta vinho', '641C34'),
('RAL', 'RAL4005', 'Blue lilac', 'Lilas bleu', 'Lilás azulado', '6C4675'),
('RAL', 'RAL4006', 'Traffic purple', 'Pourpre signalisation', 'Púrpura tráfego', 'A03472'),
('RAL', 'RAL4007', 'Purple violet', 'Violet pourpre', 'Violeta púrpura', '4A192C'),
('RAL', 'RAL4008', 'Signal violet', 'Violet de sécurité', 'Violeta sinal', '924E7D'),
('RAL', 'RAL4009', 'Pastel violet', 'Violet pastel', 'Violeta pastel', 'A18594'),
('RAL', 'RAL4010', 'Telemagenta', 'Telemagenta', 'Telemagenta', 'CF3476'),
('RAL', 'RAL4011', 'Pearl violet', 'Violet nacré', 'Violeta pérola', '8673A1'),
('RAL', 'RAL4012', 'Pearl blackberry', 'Mûre nacré', 'Amora pérola', '6C6874'),
('RAL', 'RAL5000', 'Violet blue', 'Bleu violet', 'Azul violeta', '354D73'),
('RAL', 'RAL5001', 'Green blue', 'Bleu vert', 'Azul verde', '1F3438'),
('RAL', 'RAL5002', 'Ultramarine blue', 'Bleu outremer', 'Azul ultramarino', '20214F'),
('RAL', 'RAL5003', 'Sapphire blue', 'Bleu saphir', 'Azul safira', '1D1E33'),
('RAL', 'RAL5004', 'Black blue', 'Bleu noir', 'Azul preto', '18171C'),
('RAL', 'RAL5005', 'Signal blue', 'Bleu de sécurité', 'Azul sinal', '1E2460'),
('RAL', 'RAL5007', 'Brilliant blue', 'Bleu brillant', 'Azul brilhante', '3E5F8A'),
('RAL', 'RAL5008', 'Grey blue', 'Bleu gris', 'Azul acinzentado', '26252D'),
('RAL', 'RAL5009', 'Azure blue', 'Bleu azur', 'Azul azure', '25669'),
('RAL', 'RAL5010', 'Gentian blue', 'Bleu gentiane', 'Azul genciana', '0E294B'),
('RAL', 'RAL5011', 'Steel blue', 'Bleu acier', 'Azul aço', '231A24'),
('RAL', 'RAL5012', 'Light blue', 'Bleu clair', 'Azul claro', '3B83BD'),
('RAL', 'RAL5013', 'Cobalt blue', 'Bleu cobalt', 'Azul cobalto', '1E213D'),
('RAL', 'RAL5014', 'Pigeon blue', 'Bleu pigeon', 'Azul pombo', '606E8C'),
('RAL', 'RAL5015', 'Sky blue', 'Bleu ciel', 'Azul céu', '2271B3'),
('RAL', 'RAL5017', 'Traffic blue', 'Bleu signalisation', 'Azul tráfego', '63971'),
('RAL', 'RAL5018', 'Turquoise blue', 'Bleu turquoise', 'Azul turquesa', '3F888F'),
('RAL', 'RAL5019', 'Capri blue', 'Bleu capri', 'Azul capri', '1B5583'),
('RAL', 'RAL5020', 'Ocean blue', 'Bleu océan', 'Azul oceano', '1D334A'),
('RAL', 'RAL5021', 'Water blue', 'Bleu d''eau', 'Azul água', '256D7B'),
('RAL', 'RAL5022', 'Night blue', 'Bleu nuit', 'Azul noite', '252850'),
('RAL', 'RAL5023', 'Distant blue', 'Bleu distant', 'Azul distante', '49678D'),
('RAL', 'RAL5024', 'Pastel blue', 'Bleu pastel', 'Azul pastel', '5D9B9B'),
('RAL', 'RAL5025', 'Pearl gentian blue', 'Bleu gentiane nacré', 'Azul genciana pérola', '2A6478'),
('RAL', 'RAL5026', 'Pearl night blue', 'Bleu nuit nacré', 'Azul noite pérola', '102C54'),
('RAL', 'RAL6000', 'Patina green', 'Vert patine', 'Verde patina', '316650'),
('RAL', 'RAL6001', 'Emerald green', 'Vert émeraude', 'Verde esmeralda', '287233'),
('RAL', 'RAL6002', 'Leaf green', 'Vert feuillage', 'Verde folha', '2D572C'),
('RAL', 'RAL6003', 'Olive green', 'Vert olive', 'Verde oliva', '424632'),
('RAL', 'RAL6004', 'Blue green', 'Vert bleu', 'Verde azulado', '1F3A3D'),
('RAL', 'RAL6005', 'Moss green', 'Vert Basque', 'Verde musgo', '2F4538'),
('RAL', 'RAL6006', 'Grey olive', 'Olive gris', 'Oliva acinzentado', '3E3B32'),
('RAL', 'RAL6007', 'Bottle green', 'Vert bouteille', 'Verde garrafa', '343B29'),
('RAL', 'RAL6008', 'Brown green', 'Vert brun', 'Verde marrom', '39352A'),
('RAL', 'RAL6009', 'Fir green', 'Vert sapin', 'Verde abeto', '31372B'),
('RAL', 'RAL6010', 'Grass green', 'Vert herbe', 'Verde grama', '35682D'),
('RAL', 'RAL6011', 'Reseda green', 'Vert résêda', 'Verde reseda', '587246'),
('RAL', 'RAL6012', 'Black green', 'Vert noir', 'Verde preto', '343E42'),
('RAL', 'RAL6013', 'Reed green', 'Vert jonc', 'Verde junco', '6C7156'),
('RAL', 'RAL6014', 'Yellow olive', 'Olive jaune', 'Oliva amarelado', '47402E'),
('RAL', 'RAL6015', 'Black olive', 'Olive noir', 'Oliva preto', '3B3C36'),
('RAL', 'RAL6016', 'Turquoise green', 'Vert turquoise', 'Verde turquesa', '1E5945'),
('RAL', 'RAL6017', 'May green', 'Vert mai', 'Verde maio', '4C9141'),
('RAL', 'RAL6018', 'Yellow green', 'Vert jaune', 'Verde amarelado', '57A639'),
('RAL', 'RAL6019', 'Pastel green', 'Vert pastel', 'Verde pastel', 'BDECB6'),
('RAL', 'RAL6020', 'Chrome green', 'Vert oxyde chromique', 'Verde cromo', '2E3A23'),
('RAL', 'RAL6021', 'Pale green', 'Vert pâle', 'Verde pálido', '89AC76'),
('RAL', 'RAL6022', 'Olive drab', 'Olive brun', 'Oliva acastanhado', '25221B'),
('RAL', 'RAL6024', 'Traffic green', 'Vert signalisation', 'Verde tráfego', '308446'),
('RAL', 'RAL6025', 'Fern green', 'Vert fougère', 'Verde samambaia', '3D642D'),
('RAL', 'RAL6026', 'Opal green', 'Vert opale', 'Verde opala', '015D52'),
('RAL', 'RAL6027', 'Light green', 'Vert clair', 'Verde claro', '84C3BE'),
('RAL', 'RAL6028', 'Pine green', 'Vert pin', 'Verde pinheiro', '2C5545'),
('RAL', 'RAL6029', 'Mint green', 'Vert menthe', 'Verde menta', '20603D'),
('RAL', 'RAL6032', 'Signal green', 'Vert de sécurité', 'Verde sinal', '317F43'),
('RAL', 'RAL6033', 'Mint turquoise', 'Turquoise menthe', 'Turquesa menta', '4,97E+78'),
('RAL', 'RAL6034', 'Pastel turquoise', 'Turquoise pastel', 'Turquesa pastel', '7FB5B5'),
('RAL', 'RAL6035', 'Pearl green', 'Vert nacré', 'Verde pérola', '1C542D'),
('RAL', 'RAL6036', 'Pearl opal green', 'Vert opale nacré', 'Verde opala pérola', '193737'),
('RAL', 'RAL6037', 'Pure green', 'Vert pur', 'Verde puro', '008F39'),
('RAL', 'RAL6038', 'Luminous green', 'Vert brillant', 'Verde luminoso', '00BB2D'),
('RAL', 'RAL7000', 'Squirrel grey', 'Gris petit-gris', 'Cinza esquilo', '78858B'),
('RAL', 'RAL7001', 'Silver grey', 'Gris argent', 'Cinza prata', '8A9597'),
('RAL', 'RAL7002', 'Olive grey', 'Gris olive', 'Cinza oliva', '7E7B52'),
('RAL', 'RAL7003', 'Moss grey', 'Gris mousse', 'Cinza musgo', '6C7059'),
('RAL', 'RAL7004', 'Signal grey', 'Gris de sécurité', 'Cinza sinal', '969992'),
('RAL', 'RAL7005', 'Mouse grey', 'Gris souris', 'Cinza rato', '646B63'),
('RAL', 'RAL7006', 'Beige grey', 'Gris beige', 'Cinza bege', '6D6552'),
('RAL', 'RAL7008', 'Khaki grey', 'Gris kaki', 'Cinza cáqui', '6A5F31'),
('RAL', 'RAL7009', 'Green grey', 'Gris vert', 'Cinza verde', '4D5645'),
('RAL', 'RAL7010', 'Tarpaulin grey', 'Gris tente', 'Cinza lona', '4C514A'),
('RAL', 'RAL7011', 'Iron grey', 'Gris fer', 'Cinza ferro', '434B4D'),
('RAL', 'RAL7012', 'Basalt grey', 'Gris basalte', 'Cinza basalto', '4E5754'),
('RAL', 'RAL7013', 'Brown grey', 'Gris brun', 'Cinza marrom', '464531'),
('RAL', 'RAL7015', 'Slate grey', 'Gris ardoise', 'Cinza ardósia', '434750'),
('RAL', 'RAL7016', 'Anthracite grey', 'Gris anthracite', 'Cinza antracite', '293133'),
('RAL', 'RAL7021', 'Black grey', 'Gris noir', 'Cinza preto', '23282B'),
('RAL', 'RAL7022', 'Umbra grey', 'Gris terre d''ombre', 'Cinza umbra', '332F2C'),
('RAL', 'RAL7023', 'Concrete grey', 'Gris béton', 'Cinza concreto', '686C5E'),
('RAL', 'RAL7024', 'Graphite grey', 'Gris graphite', 'Cinza grafite', '474A51'),
('RAL', 'RAL7026', 'Granite grey', 'Gris granit', 'Cinza granito', '2F353B'),
('RAL', 'RAL7030', 'Stone grey', 'Gris pierre', 'Cinza pedra', '8B8C7A'),
('RAL', 'RAL7031', 'Blue grey', 'Gris bleu', 'Cinza azulado', '474B4E'),
('RAL', 'RAL7032', 'Pebble grey', 'Gris silex', 'Cinza seixo', 'B8B799'),
('RAL', 'RAL7033', 'Cement grey', 'Gris ciment', 'Cinza cimento', '7D8471'),
('RAL', 'RAL7034', 'Yellow grey', 'Gris jaune', 'Cinza amarelado', '8F8B66'),
('RAL', 'RAL7035', 'Light grey', 'Gris clair', 'Cinza claro', 'D7D7D7'),
('RAL', 'RAL7036', 'Platinum grey', 'Gris platine', 'Cinza platina', '7F7679'),
('RAL', 'RAL7037', 'Dusty grey', 'Gris poussière', 'Cinza poeira', '7D7F7D'),
('RAL', 'RAL7038', 'Agate grey', 'Gris agate', 'Cinza ágata', 'B5B8B1'),
('RAL', 'RAL7039', 'Quartz grey', 'Gris quartz', 'Cinza quartzo', '6C6960'),
('RAL', 'RAL7040', 'Window grey', 'Gris fenêtre', 'Cinza janela', '9DA1AA'),
('RAL', 'RAL7042', 'Traffic grey A', 'Gris signalisation A', 'Cinza tráfego A', '8D948D'),
('RAL', 'RAL7043', 'Traffic grey B', 'Gris signalisation B', 'Cinza tráfego B', '4E5452'),
('RAL', 'RAL7044', 'Silk grey', 'Gris soie', 'Cinza seda', 'CAC4B0'),
('RAL', 'RAL7045', 'Telegrey 1', 'Telegris 1', 'Telecinza 1', '909090'),
('RAL', 'RAL7046', 'Telegrey 2', 'Telegris 2', 'Telecinza 2', '82898F'),
('RAL', 'RAL7047', 'Telegrey 4', 'Telegris 4', 'Telecinza 4', 'D0D0D0'),
('RAL', 'RAL7048', 'Pearl mouse grey', 'Gris souris nacré', 'Cinza rato pérola', '898176'),
('RAL', 'RAL8000', 'Green brown', 'Brun vert', 'Marrom verde', '826C34'),
('RAL', 'RAL8001', 'Ochre brown', 'Brun terre de Sienne', 'Marrom ocre', '955F20'),
('RAL', 'RAL8002', 'Signal brown', 'Brun de sécurité', 'Marrom sinal', '6C3B2A'),
('RAL', 'RAL8003', 'Clay brown', 'Brun argile', 'Marrom argila', '734222'),
('RAL', 'RAL8004', 'Copper brown', 'Brun cuivré', 'Marrom cobre', '8E402A'),
('RAL', 'RAL8007', 'Fawn brown', 'Brun fauve', 'Marrom fulvo', '59351F'),
('RAL', 'RAL8008', 'Olive brown', 'Brun olive', 'Marrom oliva', '6F4F28'),
('RAL', 'RAL8011', 'Nut brown', 'Brun noisette', 'Marrom avelã', '5B3A29'),
('RAL', 'RAL8012', 'Red brown', 'Brun rouge', 'Marrom avermelhado', '592321'),
('RAL', 'RAL8014', 'Sepia brown', 'Brun sépia', 'Marrom sépia', '382C1E'),
('RAL', 'RAL8015', 'Chestnut brown', 'Brun châtaigne', 'Marrom castanha', '633A34'),
('RAL', 'RAL8016', 'Mahogany brown', 'Brun acajou', 'Marrom mogno', '4C2F27'),
('RAL', 'RAL8017', 'Chocolate brown', 'Brun chocolat', 'Marrom chocolate', '45322E'),
('RAL', 'RAL8019', 'Grey brown', 'Brun gris', 'Marrom acinzentado', '403A3A'),
('RAL', 'RAL8022', 'Black brown', 'Brun noir', 'Marrom preto', '212121'),
('RAL', 'RAL8023', 'Orange brown', 'Brun orangé', 'Marrom alaranjado', 'A65E2E'),
('RAL', 'RAL8024', 'Beige brown', 'Brun beige', 'Marrom bege', '79553D'),
('RAL', 'RAL8025', 'Pale brown', 'Brun pâle', 'Marrom pálido', '755C48'),
('RAL', 'RAL8028', 'Terra brown', 'Brun terre', 'Marrom terra', '4E3B31'),
('RAL', 'RAL8029', 'Pearl copper', 'Cuivre nacré', 'Cobre pérola', '763C28'),
('RAL', 'RAL9001', 'Cream', 'Blanc crème', 'Creme', 'FDF4E3'),
('RAL', 'RAL9002', 'Grey white', 'Blanc gris', 'Branco acinzentado', 'E7EBDA'),
('RAL', 'RAL9003', 'Signal white', 'Blanc de sécurité', 'Branco sinal', 'F4F4F4'),
('RAL', 'RAL9004', 'Signal black', 'Noir de sécurité', 'Preto sinal', '282828'),
('RAL', 'RAL9005', 'Jet black', 'Noir foncé', 'Preto intenso', '0A0A0A'),
('RAL', 'RAL9006', 'White aluminium', 'Aluminium blanc', 'Alumínio branco', 'A5A5A5'),
('RAL', 'RAL9007', 'Grey aluminium', 'Aluminium gris', 'Alumínio cinza', '8F8F8F'),
('RAL', 'RAL9010', 'Pure white', 'Blanc pur', 'Branco puro', 'FFFFFF'),
('RAL', 'RAL9011', 'Graphite black', 'Noir graphite', 'Preto grafite', '1C1C1C'),
('RAL', 'RAL9016', 'Traffic white', 'Blanc signalisation', 'Branco tráfego', 'F6F6F6'),
('RAL', 'RAL9017', 'Traffic black', 'Noir signalisation', 'Preto tráfego', '1E1E1E'),
('RAL', 'RAL9018', 'Papyrus white', 'Blanc papyrus', 'Branco papiro', 'D7D7D7'),
('RAL', 'RAL9022', 'Pearl light grey', 'Gris clair nacré', 'Cinza claro pérola', '9C9C9C'),
('RAL', 'RAL9023', 'Pearl dark grey', 'Gris foncé nacré', 'Cinza escuro pérola', '828282'),
('OTHER', 'MDR001', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDR002', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDR003', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDR004', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDR005', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDR006', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDR007', 'Gray wood look', 'Aspect bois gris', 'Aparência de madeira cinza', ''),
('OTHER', 'MDR008', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDL001', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDL002', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDL003', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MDL004', 'Wood look', 'Aspect bois', 'Aparência de madeira', ''),
('OTHER', 'MARS M80', '', '', '', ''),
('OTHER', 'MARS 2525', 'Rust', 'Rouille', 'Ferrugem', ''),
('OTHER', 'BLEU700', 'Textured metallic blue', 'Bleu métallisé texturé', 'Azul metálico texturizado', '');


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


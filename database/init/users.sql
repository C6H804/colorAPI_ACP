-- @always use "" instead of ''
-- this page contains the sql request to create the users and their acces to the database

-- ||=========================================================||
-- ||LISTE DE TOUS LES DAO DU PROJET AVEC PERMISSIONS REQUISES||
-- ||=========================================================||

/*
Liste complète des 18 DAO dans le dossier server/dao/ avec leurs permissions minimales :

1.  addColor.dao.js                 → INSERT INTO colors
2.  addColorLog.dao.js              → INSERT INTO update_colors
3.  addUser.dao.js                  → INSERT INTO users
4.  changePassword.dao.js           → UPDATE users (colonne password) + SELECT (colonnes id, deleted)
5.  deleteColor.dao.js              → UPDATE colors (colonne deleted) + SELECT (colonne id)
6.  deleteUser.dao.js               → UPDATE users (colonne deleted) + DELETE FROM users_permissions + SELECT (colonne id)
7.  getColorById.dao.js             → SELECT FROM colors
8.  getColorList.dao.js             → SELECT FROM colors (3 fonctions différentes)
9.  getLogs.dao.js                  → SELECT FROM update_colors + JOIN users, colors, colors_changes_types
10. getUserById.dao.js              → SELECT FROM users
11. getUserByUsername.dao.js        → SELECT FROM users
12. getUserPermissions.dao.js       → SELECT FROM users_permissions + JOIN permissions, users
13. getUsers.dao.js                 → SELECT FROM users
14. isUserAdmin.dao.js              → SELECT FROM users_permissions
15. permissions.dao.js              → SELECT, INSERT FROM permissions + SELECT, INSERT, DELETE FROM users_permissions + SELECT FROM users
16. updateColorStockById.dao.js     → UPDATE colors (colonnes shiny_stock, matte_stock, sanded_stock) + SELECT (colonne id)
17. updateLastConnexion.dao.js      → UPDATE users (colonne last_connection) + SELECT (colonne id)
18. updateUser.dao.js               → UPDATE users (colonnes username, description) + SELECT (colonnes id, deleted)
*/


-- show existing users
SELECT User, Host FROM mysql.user;

-- DROP USERS IF THEY ALREADY EXIST
DROP USER IF EXISTS "colorAdder"@"localhost";
DROP USER IF EXISTS "colorLogAdder"@"localhost";
DROP USER IF EXISTS "userAdder"@"localhost";
DROP USER IF EXISTS "passwordChanger"@"localhost";
DROP USER IF EXISTS "colorDeleter"@"localhost";
DROP USER IF EXISTS "userDeleter"@"localhost";
DROP USER IF EXISTS "colorReader"@"localhost";
DROP USER IF EXISTS "logReader"@"localhost";
DROP USER IF EXISTS "userReader"@"localhost";
DROP USER IF EXISTS "usersPermissionsReader"@"localhost";
DROP USER IF EXISTS "permissionsManager"@"localhost";
DROP USER IF EXISTS "colorStockChanger"@"localhost";
DROP USER IF EXISTS "userChanger"@"localhost";

CREATE USER "colorAdder"@"localhost" IDENTIFIED BY "k1ZY8wyt5FfF";
GRANT INSERT ON api_acp.colors TO "colorAdder"@"localhost";

CREATE USER "colorLogAdder"@"localhost" IDENTIFIED BY "Fr5sd8VXbVC5";
GRANT INSERT ON api_acp.update_colors TO "colorLogAdder"@"localhost";

CREATE USER "userAdder"@"localhost" IDENTIFIED BY "dXep6AuE75KG";
GRANT INSERT ON api_acp.users TO "userAdder"@"localhost";

CREATE USER "passwordChanger"@"localhost" IDENTIFIED BY "e48pImxSCEX2";
GRANT UPDATE, SELECT ON api_acp.users TO "passwordChanger"@"localhost";

CREATE USER "colorDeleter"@"localhost" IDENTIFIED BY "e8S3K0vXZe62";
GRANT UPDATE, SELECT ON api_acp.colors TO "colorDeleter"@"localhost";

CREATE USER "userDeleter"@"localhost" IDENTIFIED BY "D4aD497uCJPJ";
GRANT UPDATE, SELECT ON api_acp.users TO "userDeleter"@"localhost";

CREATE USER "colorReader"@"localhost" IDENTIFIED BY "Sb6NZMU764iS";
GRANT SELECT ON api_acp.colors TO "colorReader"@"localhost";

CREATE USER "logReader"@"localhost" IDENTIFIED BY "5Nqp0l63Lg6g";
GRANT SELECT ON api_acp.update_colors TO "logReader"@"localhost";
GRANT SELECT ON api_acp.users TO "logReader"@"localhost";
GRANT SELECT ON api_acp.colors_changes_types TO "logReader"@"localhost";
GRANT SELECT ON api_acp.colors TO "logReader"@"localhost";

CREATE USER "userReader"@"localhost" IDENTIFIED BY "1ZLM74WqdcqP";
GRANT SELECT ON api_acp.users TO "userReader"@"localhost";
GRANT SELECT ON api_acp.users_permissions TO "userReader"@"localhost";
GRANT SELECT ON api_acp.permissions TO "userReader"@"localhost";

CREATE USER "usersPermissionsReader"@"localhost" IDENTIFIED BY "1fNyP7SPwZ8i";
GRANT SELECT ON api_acp.users_permissions TO "adminChecker"@"localhost";
GRANT SELECT ON api_acp.permissions TO "adminChecker"@"localhost";

CREATE USER "permissionsManager"@"localhost" IDENTIFIED BY "Olj9n19gHXFI";
GRANT SELECT, INSERT ON api_acp.permissions TO "permissionsManager"@"localhost";
GRANT SELECT, INSERT, DELETE ON api_acp.users_permissions TO "permissionsManager"@"localhost";
GRANT SELECT ON api_acp.users TO "permissionsManager"@"localhost";

CREATE USER "colorStockChanger"@"localhost" IDENTIFIED BY "8CJiG20j0s5L";
GRANT UPDATE, SELECT ON api_acp.colors TO "colorStockChanger"@"localhost";

CREATE USER "userChanger"@"localhost" IDENTIFIED BY "wGyq7k07gLgX";
GRANT UPDATE, SELECT ON api_acp.users TO "userChanger"@"localhost";
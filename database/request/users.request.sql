-- get user by id
SELECT * from users where id = 1;
-- SELECT * from users where id = ?, [id];


-- grant permission to user by userId and permissionId
INSERT INTO users_permissions (id_user, id_permission) VALUES (1, 1);
-- INSERT INTO users_permissions (id_user, id_permission) VALUES (?, ?), [userId, permissionId];

-- delete users
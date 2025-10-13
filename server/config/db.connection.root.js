const mysql = require("mysql2");

const passwords = {
    colorAdder: "k1ZY8wyt5FfF",
    colorLogAdder: "Fr5sd8VXbVC5",
    userAdder: "dXep6AuE75KG",
    passwordChanger: "e48pImxSCEX2",
    colorDeleter: "e8S3K0vXZe62",
    userDeleter: "D4aD497uCJPJ",
    colorReader: "Sb6NZMU764iS",
    logReader: "5Nqp0l63Lg6g",
    userReader: "1ZLM74WqdcqP",
    usersPermissionsReader: "1fNyP7SPwZ8i",
    permissionsManager: "Olj9n19gHXFI",
    colorStockChanger: "8CJiG20j0s5L",
    userChanger: "wGyq7k07gLgX",
}

const pool = mysql.createPool({
    host: "ca664385-001.eu.clouddb.ovh.net",
    user: "Alan",
    password: "Acportail40",
    database: "API",
    port: 35521
});

module.exports = pool.promise();
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

// Configuration for connection pools
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "0000",
    database: process.env.DB_DATABASE || "api_acp",
    port: process.env.DB_PORT || 3306,
    // Connection pool settings to prevent "too many connections" error
    connectionLimit: 10,          // Maximum number of connections in pool
    acquireTimeout: 60000,        // Maximum time to get a connection
    timeout: 60000,               // Maximum time for a query
    reconnect: true,              // Automatically reconnect
    idleTimeout: 300000,          // Close idle connections after 5 minutes
    maxIdle: 10,                  // Maximum idle connections
}

// Singleton pattern: create pools once and reuse them
const pools = {};

const getPool = (user) => {
    if (!pools[user]) {
        pools[user] = mysql.createPool(poolConfig);
    }
    return pools[user];
}

// Legacy function for backward compatibility
const connect = (user) => {
    return getPool(user);
}

// Function to properly close all pools (useful for graceful shutdown)
const closeAllPools = async () => {
    const promises = Object.values(pools).map(pool => 
        new Promise((resolve) => {
            pool.end(() => resolve());
        })
    );
    await Promise.all(promises);
    // Clear the pools object
    Object.keys(pools).forEach(key => delete pools[key]);
}

module.exports = { connect, getPool, closeAllPools };
const express = require("express");
const ReadToken = require("../utils/_ReadToken");
const getUserById = require("../dao/getUserById.dao");


const auth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token provided", status: 401 });
    const user = ReadToken(token.split(' ')[1]);
    if (!user.valid) return res.status(401).json({ message: "Invalid token", status: 401 });

    const userId = user.value.id;
    const userData = await getUserById(userId);
    if (!userData.valid) return res.status(userData.status).json({ message: userData.message, status: userData.status });

    req.user = user;

    next();
};

module.exports = auth;
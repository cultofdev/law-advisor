const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const accessToken = req.headers.authorization

    if(accessToken == null) {
        res.status(401).send('Invalid access token..');
    } else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                res.status(400).send('An error occurred while parsing token..');
            } else {
                next();
            }
        });
    }
}

module.exports = authenticateToken;
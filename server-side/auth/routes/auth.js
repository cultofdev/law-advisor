require('dotenv').config();

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../db/mongodb');

router.post('/login', async (req, res) => {
    const creds = req.body;

    const user = await findUser(creds);

    let isPasswordMatched = false;

    if(user) {
        isPasswordMatched = await bcrypt.compare(creds.password, user.password);
    }

    if(isPasswordMatched) {
        const payload = { username: user.username };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.status(200).send({ AccessToken: accessToken, RefreshToken: refreshToken, userId: user._id });
    } else {
        res.status(401).send({ message: 'Invalid username and/or password' });
    }
});

const findUser = async (user) => {
    const dbConnection = db.getDb();

    const data = await dbConnection.collection('users').findOne({ 'username': user.username });

    return data;
};

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;
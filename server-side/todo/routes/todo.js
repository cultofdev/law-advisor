const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = require('../util/security/auth');

const db = require('../db/mongodb');

/* get todo listing */
router.get('/', authenticateToken, (req, res, next) => {
    const dbConnection = db.getDb();
    console.log(req.query.userId)
    dbConnection.collection('todo').find({'user_id': req.query.userId}).toArray((err, result) => {
        if(err) {
            res.status(400).send({ message: 'Error retrieving records..' });
        } else {
            res.json(result);
        }
    });
});

/* create todo list */
router.post('/', authenticateToken, (req, res, next) => {
    const dbConnection = db.getDb();

    const todo = {
        user_id: req.body.user_id,
        status: req.body.status,
        title: req.body.title,
        description: req.body.description
    };

    dbConnection.collection('todo').insertOne(todo, (err, result) => {
        if(err) {
            res.status(400).send({ message: 'Error inserting record..' });
        } else {
            console.log(`Added a new record with id ${result.insertedId}`);
            res.status(204).send({ message: 'Successfully created a record!' });
        }
    });
});

/* update a todo record */
router.put('/', authenticateToken, (req, res, next) => {
    const dbConnection = db.getDb();

    const todoQuery = { '_id': ObjectId(req.body._id) };

    const updates = {
        $set: {
            status: req.body.status,
            title: req.body.title,
            description: req.body.description
        }
    };

    dbConnection.collection('todo').updateOne(todoQuery, updates, (err, result) => {
        if(err) {
            res.status(400).send({ message: `Error updating record with id ${todoQuery.id}` });
        } else {
            res.status(200).send({ message: '1 record updated..' });
        }
    });
});

/* delete a todo record */
router.delete('/', authenticateToken, (req, res, next) => {
    const dbConnection = db.getDb();

    const todoQuery = { '_id': ObjectId(req.query._id) };

    dbConnection.collection('todo').deleteOne(todoQuery, (err, result) => {
        if(err) {
            res.status(400).send({ message: `Error deleting record with id ${todoQuery.id}` });
        } else {
            res.status(200).send({ message: '1 record deleted..' });
        }
    });
});

module.exports = router;

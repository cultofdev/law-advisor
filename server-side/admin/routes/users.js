const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const db = require('../db/mongodb');

/* get user */
router.route('/').get(async (req, res) => {
  const dbConnection = db.getDb();

  dbConnection.collection('users').findOne({'username': req.query.username}, (err, result) => {
    if(err) {
      res.status(400).send({ message: 'Error retrieving users..' });
    } else {
      res.json([result]);
    }
  });
});

/* create user */
router.route('/').post(async (req, res) => {
  const dbConnection = db.getDb();
  
  reqBodyEmpty = Object.values(req.body).every(x => x === '' || x === null);

  if(!reqBodyEmpty) {
    const user = {
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10)
    };

    dbConnection.collection('users').insertOne(user, (err, result) => {
      if(err) {
        res.status(400).send({ message: 'Error creating user.' });
      } else {
        console.log(`Added a new user with id ${result.insertedId}`);
        res.status(204).send({ message: 'Successfully created user.' });
      }
    });
  } else {
    res.status(400).send({ message: 'Error creating user.' });
  }
  
});

module.exports = router;

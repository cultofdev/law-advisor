const { MongoClient } = require('mongodb');
require('dotenv').config();

const connectionString = process.env.MONGO_DB;

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let dbConnection;

module.exports = {
    connectToServer: (callback) => {
        client.connect(function(err, db) {
            if(err || !db) {
                return callback(err);
            }

            dbConnection = db.db('law-advisor');
            console.log('Successfully connected to MongoDB!');

            return callback();
        });
    },
    
    getDb: () => {
        return dbConnection;
    }
}
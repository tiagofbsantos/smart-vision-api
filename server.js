const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
  	connection: {
    	connectionString : process.env.DATABASE_URL,
    	ssl: true
	}
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('It is working!'))
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', image.handleApiCall())

app.listen(process.env.PORT || 3005, () => console.log(`app is running on port ${process.env.PORT}`))
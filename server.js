const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

const db = knex({
	client: 'pg',
  	connection: process.env.POSTGRES_URI
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req, res) => res.send('It is working!'))
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db))
app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db))
app.put('/image', auth.requireAuth, image.handleImage(db))
app.post('/imageurl', auth.requireAuth, image.handleApiCall())

app.listen(3005, () => console.log(`app is running on port 3005`))
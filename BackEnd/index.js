const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const cors = require('cors');
app.use(cors());

const Login = require('./Auth/Login');
const Signup = require('./Auth/Signup');


app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.post('/login', Login);
app.put('/signup', Signup);




app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
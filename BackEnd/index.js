const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const cors = require('cors');
app.use(cors());

const Login = require('./Auth/Login');
const Signup = require('./Auth/Signup');
const GetUser = require('./GetData/GetUser');


app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.post('/login', Login);
app.put('/signup', Signup);
app.post('/getUser', GetUser)




app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
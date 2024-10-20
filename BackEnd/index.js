const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const cors = require('cors');
app.use(cors());

const Login = require('./Auth/Login');
const Signup = require('./Auth/Signup');
const GetUser = require('./GetData/GetUser');
const addWork = require('./Work/addWork');
const editWork = require('./Work/editWork');
const deleteWork = require('./Work/deleteWork');
const addJob = require('./Jobs/addJob');
const getJob = require('./GetData/getJob');

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.post('/login', Login);
app.put('/signup', Signup);
app.post('/getUser', GetUser)
app.put('/addWork', addWork);
app.put('/editWork', editWork);
app.put('/deleteWork', deleteWork);
app.post('/addJob', addJob);
app.post('/getJob', getJob);




app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
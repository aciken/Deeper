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
const deleteJob = require('./Jobs/deleteJob');
const editJob = require('./Jobs/editJob');
const updateWeeklyWork = require('./Jobs/updateWeeklyWork');
const editPreset = require('./Presets/editPreset');
const addToSchedule = require('./Presets/addToSchedule');
const createNewPreset = require('./Presets/createNewPreset');
const deletePreset = require('./Presets/deletePreset');
const restorePreset = require('./Presets/restorePreset');
const startCurrentSession = require('./Work/startCurrentSession');
const changeDaily = require('./Tracker/changeDaily');


app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.post('/login', Login);
app.put('/signup', Signup);
app.post('/getUser', GetUser)
app.put('/addWork', addWork);
app.put('/editWork', editWork);
app.put('/deleteWork', deleteWork);
app.put('/addJob', addJob);
app.post('/getJob', getJob);
app.put('/deleteJob', deleteJob);
app.put('/editJob', editJob);
app.put('/updateWeeklyWork', updateWeeklyWork);
app.put('/editPreset', editPreset);
app.put('/addToSchedule', addToSchedule);
app.put('/createNewPreset', createNewPreset);
app.put('/deletePreset', deletePreset);
app.put('/restorePreset', restorePreset);
app.put('/startCurrentSession', startCurrentSession);
app.put('/updateTracker', changeDaily);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
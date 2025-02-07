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
const startSession = require('./Session/startSession');
const endSession = require('./Session/endSession');
const changeDaily = require('./Challenges/changeDaily');
const collectDaily = require('./Challenges/collectDaily')
const collectGeneral = require('./Challenges/collectGeneral')
const Verify = require('./Auth/Verify');
const ForgotPasswordEmail = require('./Auth/ForgotPasswordEmail');
const ForgotPasswordVerification = require('./Auth/ForgotPasswordVerification');
const resetPassword = require('./Auth/resetPassword');


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
app.put('/startSession', startSession);
app.put('/endSession', endSession);
app.put('/changeDaily', changeDaily);
app.put('/collectDaily', collectDaily);
app.put('/collectGeneral', collectGeneral)
app.put('/verify', Verify);
app.post('/forgotPassword', ForgotPasswordEmail);
app.post('/forgotPasswordVerification', ForgotPasswordVerification);
app.post('/forgotPasswordReset', resetPassword);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
const User = require('../DataBase/User');

const restorePreset = async (req, res) => {
    const { id, presetIndex } = req.body;

    const user = await User.findOne({ _id: id }); 
    if(user){

        console.log(presetIndex, user.preset[presetIndex].name)
        let data;
        if(user.preset[presetIndex].name === 'Morning Work'){
            data = {
                name: 'Morning Work',
                sessions: [
                  ['06:00', '08:00','Morning Session 1', user.work[0]._id, 120,160],
                  ['09:00', '11:00','Morning Session 2', user.work[0]._id, 180,220],
                  ['12:00', '14:00','Morning Session 3', user.work[0]._id, 240,280]
                ]
              }
        } else if(user.preset[presetIndex].name === 'Evening Work'){
            data = {
                name: 'Evening Work',
                sessions: [
                  ['15:00', '17:00','Evening Session 1', user.work[0]._id, 300,340],
                  ['18:00', '20:00','Evening Session 2', user.work[0]._id, 360,400],
                  ['21:00', '23:00','Evening Session 3', user.work[0]._id, 420,460]
                ]
              }
        } else if(user.preset[presetIndex].name === 'Noon Work'){
            data = {
                name: 'Noon Work',  
                sessions: [
                  ['12:00', '14:00','Noon Session 1', user.work[0]._id, 240,280]
                ]
              }
        }
        user.preset[presetIndex] = data;
        await user.save();
        res.status(200).json(user);
    }
    else{
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = restorePreset;


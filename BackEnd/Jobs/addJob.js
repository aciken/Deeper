const User = require('../DataBase/User');
const mongoose = require('mongoose');

const AddJob = async (req, res) => {
    const { id, newWork } = req.body;
    console.log('adding job')
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            // Generate a new ObjectId for the job



            newWork._id = new mongoose.Types.ObjectId();

            if(user.work.length === 0){
                user.preset.push(
                    {
                        name: 'Morning Work',
                        sessions: [
                          ['06:00', '08:00','Morning Session 1', newWork._id, 120,160],
                          ['09:00', '11:00','Morning Session 2', newWork._id, 180,220],
                          ['12:00', '14:00','Morning Session 3', newWork._id, 240,280]
                        ]
                      },
                      {
                        name: 'Evening Work',
                        sessions: [
                          ['15:00', '17:00','Evening Session 1', newWork._id, 210,250],
                          ['18:00', '20:00','Evening Session 2', newWork._id, 270,310],
                          ['21:00', '23:00','Evening Session 3', newWork._id, 330,370]
                        ]
                      },
                      {
                        name: 'Noon Work',
                        sessions: [
                          ['12:00', '14:00','Noon Session 1', newWork._id, 240,280]
                        ]
                      }
                )

                
            }

            user.work.push(newWork);
        }
        
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
}

module.exports = AddJob;

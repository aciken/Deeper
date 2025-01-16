const User = require('../DataBase/User');
const mongoose = require('mongoose');

const startSession = async (req, res) => {
    try {
        const { id, selectedWork, startTime, endTime, date, sessionName } = req.body;
        
        const sessionId = new mongoose.Types.ObjectId();
        
        const session = {
            startTime,
            endTime,
            name: sessionName,
            workId: selectedWork._id,
            sessionId,
            date
        };

        console.log('session', session)

        const user = await User.findById(id);
        user.workSessions.push(session);
        await user.save();
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({message: error.message});
    }
};

module.exports = startSession;
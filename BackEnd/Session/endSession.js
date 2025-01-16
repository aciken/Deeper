const User = require('../DataBase/User');

const endSession = async (req, res) => {
    try {
        const { id, sessionId, endTime, date } = req.body;
        
        const user = await User.findById(id);
        const session = user.workSessions.find(session => session.sessionId.toString() === sessionId.toString());
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.endTime = endTime;
        session.date = date;
        
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = endSession;


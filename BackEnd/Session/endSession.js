const User = require('../DataBase/User');

const endSession = async (req, res) => {
    const {id, sessionId} = req.body;
    const user = await User.findById(id);

    // Get current time in HH:mm format
    const now = new Date();
    const minutes = now.getMinutes() - 1;
    const hours = minutes < 0 ? now.getHours() - 1 : now.getHours();
    const adjustedMinutes = minutes < 0 ? 59 : minutes;
    const currentTime = `${hours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;

    // Find and update the session
    const updatedWorkSessions = user.workSessions.map(session => {
        console.log(session.sessionId, sessionId)
        if (session.sessionId.toString() === sessionId) {
            console.log('before', session)
            console.log('currentTime', currentTime)

            // Compare times
            const [currentHours, currentMins] = currentTime.split(':').map(Number);
            const [startHours, startMins] = session.startTime.split(':').map(Number);
            
            const currentTotalMins = currentHours * 60 + currentMins;
            const startTotalMins = startHours * 60 + startMins;

            // If current time is before start time, use start time
            const endTime = currentTotalMins < startTotalMins ? session.startTime : currentTime;

            return {
                ...session,
                endTime
            };
        }
        console.log('after', session)
        return session;
    });

    // Update user document
    user.workSessions = updatedWorkSessions;
    await user.save();

    res.json(user);
}

module.exports = endSession;


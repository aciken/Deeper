const User = require('../DataBase/User');
const mongoose = require('mongoose');

const startSession = async (req, res) => {
    try {
        const {id, selectedWork, duration, sessionName} = req.body;
        
        // Get current time in 24-hour format
        const now = new Date();
        const startTime = now.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        // Calculate end time
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        
        // Convert duration object to minutes
        const durationInMinutes = (parseInt(duration.hours) * 60) + parseInt(duration.minutes);
        let totalMinutes = startHours * 60 + startMinutes + durationInMinutes;
        
        // Handle overflow past midnight
        if (totalMinutes >= 1440) { // 24 hours * 60 minutes
            totalMinutes = totalMinutes % 1440;
        }
        
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

        const sessionId = new mongoose.Types.ObjectId();
        const currentDate = new Date();
        const date = `${currentDate.getDate()}:${currentDate.getMonth() + 1}:${currentDate.getFullYear()}`;
        
        const session = {
            startTime,
            endTime,
            name: sessionName,
            workId: selectedWork._id,
            sessionId,
            date
        };

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
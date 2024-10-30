const User = require('../DataBase/User');

const startCurrentSession = async (req, res) => {
    const { sessionName, selectedWork, duration, id } = req.body;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${String(currentHours).padStart(2,'0')}:${String(currentMinutes).padStart(2,'0')}`;

    const startPoints = Math.round(currentHours * 20 + currentMinutes / 3);

    const futureTime = new Date(now.getTime() + (duration.hours * 60 * 60 * 1000) + (duration.minutes * 60 * 1000));
    const futureHours = futureTime.getHours();
    const futureMinutes = futureTime.getMinutes();
    const futureTimeString = `${String(futureHours).padStart(2,'0')}:${String(futureMinutes).padStart(2,'0')}`;

    const endPoints = Math.round(futureHours * 20 + futureMinutes / 3);

    const session = [
        currentTime,
        futureTimeString,
        sessionName,
        selectedWork._id,
        startPoints,
        endPoints
    ]
        
    const today = new Date().getDate();

    try {
        const user = await User.findOne({_id: id});
        if(user){
            let canAdd = true;
            for (let existingSession of user.array[today-1]) {
                if (session[4] < existingSession[5] && session[5] > existingSession[4]) {
                    canAdd = false;
                    break;
                }
            }
            if (canAdd) {
                // Update the array directly in the database
                const result = await User.findOneAndUpdate(
                    { _id: id },
                    { $push: { [`array.${today-1}`]: session } },
                    { new: true }
                );
                res.json(result);
            } else {
                res.json('Time overlap');
            }
        } else {
            res.json('User not found');
        }
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ error: 'Error starting session' });
    }
}

module.exports = startCurrentSession;

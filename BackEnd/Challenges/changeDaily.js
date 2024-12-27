const User = require('../DataBase/User');

const changeDaily = async (req, res) => {
    const { id, date } = req.body;

    try {
        // Get user first to check points date
        const existingUser = await User.findById(id);
        
        // Calculate days difference
        if (existingUser.points.pointsDate) {
            const [oldDay, oldMonth, oldYear] = existingUser.points.pointsDate.split(':').map(Number);
            const [newDay, newMonth, newYear] = date.split(':').map(Number);

            const oldDate = new Date(oldYear, oldMonth - 1, oldDay);
            const newDate = new Date(newYear, newMonth - 1, newDay);
            
            const diffTime = Math.abs(newDate - oldDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                existingUser.points.current = Math.max(0, existingUser.points.current - diffDays);
            }
        }

        // Generate two random unique numbers between 0-3
        let nums = new Set();
        while(nums.size < 2) {
            nums.add(Math.floor(Math.random() * 4));
        }
        const randomNums = Array.from(nums);

        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    'points.pointsDate': date,
                    'points.currentDaily': randomNums,
                    'points.dailyDone': [],
                    'points.current': existingUser.points.current
                }
            },
            { new: true }
        );

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = changeDaily;

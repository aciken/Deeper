const User = require('../DataBase/User');

const changeDaily = async (req, res) => {
    const { id, date } = req.body;
    
    try {
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
                    'points.dailyDone': []
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

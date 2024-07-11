const User = require('../DataBase/User');

const addWork = async (req, res) => {
    const { data, email, clicked } = req.body;
    console.log(req.body)



    try {
        console.log(email)
        const user = await User.findOne({email});


        if(user){

            console.log(clicked-1)
            console.log(data)
            user.Schedule[clicked-1].tasks.push(data);
            user.markModified('Schedule');
            await user.save();
            res.json(user);

        }
        
} catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = addWork;
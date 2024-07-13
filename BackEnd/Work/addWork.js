const User = require('../DataBase/User');

const addWork = async (req, res) => {
    const { data, email, clicked } = req.body;
    console.log(req.body)

    const num = clicked-1

    try {
        console.log(email)
        const user = await User.findOne({email});


        if(user){

            user.array[num].push(data);
            user.markModified('array');
            await user.save();
            res.json(user);

        }
        
} catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = addWork;
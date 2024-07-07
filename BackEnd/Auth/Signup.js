const User = require('../DataBase/User');


const Signup = async (req, res) => {
    const {name, email, password } = req.body;



    console.log('signing up started')


    const user = new User({
        name,
        email,
        password,

    });

    console.log(name,email,password)
    
    try {

        check = await User.findOne({email});
        if (check) {
            res.json('exist');
        } else{
            const newUser = await user.save();
            res.json(newUser);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = Signup;
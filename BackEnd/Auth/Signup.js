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
        console.log('asd');
        const check = await User.findOne({email}); // Added `const` for proper declaration
        if (check) {
            res.json('exist');
        } else {
            console.log('asdasdad');
            const newUser = await user.save();
            res.json(newUser);
            console.log(newUser);
        }
    } catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
};
 
module.exports = Signup;
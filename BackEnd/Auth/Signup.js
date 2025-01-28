const User = require('../DataBase/User');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');



const Signup = async (req, res) => {
    const {name, email, password, onboardingData } = req.body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const newWork = {
        _id: new mongoose.Types.ObjectId(),
        name: onboardingData.workname,
        colors: ['#2563EB',"#153885"],
        currentTime: onboardingData.worktime,
    }

    console.log('signing up started')


    const code = Math.floor(100000 + Math.random() * 900000).toString();


    const user = new User({
        name,
        email,
        password,
        work: [newWork],
        onboardingData,
        verify: code
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

            const msg = {
                to: email,
                from: { name: 'Deeper', email: 'adrian@deepersoftware.com' },
                subject: 'Verification Code',
                text: `Your verification code is: ${code}`,
                html: `
                  <div style="font-family: Arial, sans-serif; width: 100%; background-color: #f5f5f5; padding: 50px 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; text-align: center; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                      <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Verification Code</h2>
                      <p style="font-size: 16px; color: #555; margin-bottom: 20px;">Your verification code is:</p>
                      <p style="font-size: 28px; font-weight: 700; color: #007BFF; margin: 20px 0;">${code}</p>
                    </div>
                  </div>
                `,
              };
              await sgMail.send(msg);


            console.log(newUser);
        }
    } catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
};
 
module.exports = Signup;
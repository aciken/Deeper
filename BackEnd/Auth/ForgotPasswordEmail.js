const User = require('../DataBase/User');
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');


const ForgotPasswordEmail = async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const { email } = req.body;
    try {
        console.log('Sending forgot password email')
        const user = await User.findOne({email});

        // Generate a random 6 digit number for password reset
        const resetCode = Math.floor(100000 + Math.random() * 900000);


        if(user){

            await User.findByIdAndUpdate(user._id, { resetCode: resetCode });


            const msg = {
                to: email,
                from: { name: 'Deeper', email: 'adrian@deepersoftware.com' },
                subject: 'Reset Code',
                text: `Your reset code is: ${resetCode}`,
                html: `
                  <div style="font-family: Arial, sans-serif; width: 100%; background-color: #f5f5f5; padding: 50px 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; text-align: center; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                      <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Reset Code</h2>
                      <p style="font-size: 16px; color: #555; margin-bottom: 20px;">Your reset code is:</p>
                      <p style="font-size: 28px; font-weight: 700; color: #007BFF; margin: 20px 0;">${resetCode}</p>
                    </div>
                  </div>
                `,
              };

              await sgMail.send(msg);


            

            res.json(user);
        } else{
            res.json("failed");
        }
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = ForgotPasswordEmail;
const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const { connection } = require('./config/db')
const { userCrud } = require('./Routes/crudHandle');
const { userAuth } = require('./Routes/Authentication');
const { userModel } = require('./Models/model');
const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.json({ mssg: "welcome in Redura Innovative Assignment", })
})


app.use('/auth', userAuth) // for authenication 
app.use('/users', userCrud)  // for crud operation



app.post('/forgot', async (req, res) => {
    try {
        const { userName } = req.body;                         
        const user = await userModel.findOne({ userName });
        if (user) {
            console.log("found,user", user);
            const token = jwt.sign({ userId: user._id }, process.env.SECRET);
            const data = await userModel.updateOne({ userName: userName }, { $set: { token: token } });
            sendResetPasswordMail(userName, token)  // here userName is the gmail where you got reset link
            res.status(200).json({ message: 'Password reset email sent, please check your mail' });

        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> reset mail function  >>>>>>>>>>>>>>>>>>>>>>>>
const sendResetPasswordMail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: false,

            auth: {
                user: 'nkanko8@gmail.com',
                pass: 'nhgklvkctjrzwxmb',
            },
        });

        const mailOptions = {
            from: 'nkanko8@gmail.com',
            to: email,
            subject: 'Email reset Password',
            html:
                '<p>Please copy following link to reset your email password:</p>' +
                '<a href="http://localhost:5500/reset?token=' + token + '"> click here </a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error in sending email  ' + error);
                return true;
            } else {
                console.log('Email sent: ' + info.response);
                return false;
            }
        });
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "Error" })
    }
}




app.get('/reset', async (req, res) => {
    try {
        const { token } = req.query;
        const user = await userModel.findOne({ token: token });

        if (user) {
            console.log("user mila");
            const { password } = req.body;
            console.log(password)
            const hash = bcrypt.hashSync(password, 8);
            console.log("hashpass")
            const updatedData = await userModel.findByIdAndUpdate(
                { _id: user._id },
                { $set: { password: hash, token: '' } },
                { new: true }
            );
            console.log(updatedData)
            res.status(200).json({ mssg: "Password reset successfully", data: updatedData });
        } else {
            console.log("user nhi mila");
            res.status(200).json({ mssg: "this link has been expired" });
        }
    } catch (error) {
        res.status(404).json({ mssg: "error while resetting", error });
    }
});



app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("connection established")
    } catch (error) {
        console.log(error, 'connection failed with database')
    }
    console.log("listening on port 5500")
})
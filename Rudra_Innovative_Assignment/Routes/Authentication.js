const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express')

const { userModel } = require("../Models/model");

const userAuth = Router();


userAuth.post('/reg', async (req, res) => {
    const { userName, password } = req.body
    try {
        const hash = bcrypt.hashSync(password, 8);
        console.log(hash)
        const user = userModel({
            userName,
            password: hash
        })
        await user.save()
        res.status(200).json({ mssg: "registeration successfull" })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "error while registeration" })
    }
})


// >>>>>>>>>>>>>>>>>>>>>>>>> Login >>>>>>>>>>>>>>>>>>>>>>>>>
userAuth.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await userModel.findOne({ userName: userName })
        const pass = bcrypt.compareSync(password, user.password);
        if (pass) {
            const token = jwt.sign({ userName: user.userName }, process.env.SECRET);
            res.status(200).json({ mssg: "login success", token: token })
        } else {
            res.status(401).json({ msg: "invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mssg: "login failed user not found" })
    }
})

module.exports = { userAuth }
const { Router } = require('express');
const { userModel } = require('../Models/model');
const bcrypt = require('bcrypt');



const userCrud = Router();


// >>>>>>>>>>>>>>>>>>>>>>>> Post Request >>>>>>>>>>>>>>>>>>>>>>>>>

userCrud.post('/addUser', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const hashPassword = bcrypt.hashSync(password, 8);
        const user = userModel({
            userName,
            password: hashPassword
        })
        await user.save();
        res.status(200).json({ mssg: "user  saved successfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ mssg: "error saving user" })
    }
})


// >>>>>>>>>>>>>>>>>>>>>>>>>>>> get user list >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

userCrud.get('/usersList', async (req, res) => {
    try {
        const user = await userModel.find();
        res.status(200).json({ mssg: "users List", users: user })
    } catch (error) {
        res.status(500).json({ mssg: "error getting users" })
    }
})


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update >>>>>>>>>>>>>>>>>>>>>>>>


userCrud.put('/updateUser/:id', async (req, res) => {

    const { id } = req.params
    const { userName, password } = req.body
    try {

        const hashPassword = bcrypt.hashSync(password, 8);
        const user = await userModel.findByIdAndUpdate(id, {
            userName,
            password: hashPassword
        })
        if (user) {
            res.status(200).json({ mssg: "Successfully Updated" })
        } else {
            res.status(404).json({ mssg: "user not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ mssg: "update failed fill all the fields" })
    }
})

userCrud.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete({ _id: id })
        if (user) {
            res.status(200).json({ mssg: "deleted successfully" })
        } else {
            res.status(404).json({ mssg: " user not found" })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({ mssg: "error  while deleting" })
    }
})

module.exports = { userCrud }


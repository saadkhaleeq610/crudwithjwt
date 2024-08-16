import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from 'cors';
import StudentModel from './models/Student.js'

const app = express()
app.use(express.json())
app.options('*', cors())
// app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/school')

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    StudentModel.create({name, email, password})
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.post('/login',(req, res) => {
    const {email, password} = req.body;
    StudentModel.findOne({email})
    .then((user) => {
        if(user){
            if(user.password === password) {
                const accessToken = jwt.sign({email: email}, 
                    "jwt-access-token-secret-key", {expiresIn: "1m"})
                const refreshToken = jwt.sign({email: email}, 
                    "jwt-refresh-token-secret-key", {expiresIn: "5m"})
                res.cookie("accessToken", accessToken, {maxAge: 60000})
                res.cookie("refreshToken", refreshToken, 
                    {maxAge: 300000, httpOnly: true, secure: true, sameSite: "strict"})
                res.json("Login Successful")
            }
        } else {
            console.log("No record existed")
        }
    }).catch(err => res.json(err))
})

app.listen(3000, ()=>{
    console.log("Server is running")
})
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')

const mongoose = require('mongoose')
const db = "mongodb://userckmd:rachmad51@ds145923.mlab.com:45923/authdb"

mongoose.connect(db, err => {
    if(err){
        console.error('error !'+ err)
    }
    else{
        console.log('connected to mongodb')
    }
})

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payLoad = jwt.verify(token, 'secretKey')
    if(!payLoad){
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payLoad.subject
    next()
}

router.get('/', (req,res) => {
    res.send('from API routes')
})

router.post('/register', (req,res)=>{
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser)=>{
        if(error){
            console.log(error)
        }
        else{
            let payLoad = { subject: registeredUser._id }
            let token = jwt.sign(payLoad, 'secretKey')
            res.status(200).send({token})
        }
    })
})

router.post('/login',(req,res)=>{
    let userData = req.body
    User.findOne({email: userData.email},(error,user)=>{
        if(error){
            console.log(error)
        }
        else{
            if(!user){
                res.status(401).send('invalid email')
            }
            else
            if(user.password !== userData.password){
                res.status(401).send('invalid password')
            }
            else{
                let payLoad = { subject: user._id}
                let token = jwt.sign(payLoad,'secretKey')
                res.status(200).send({token})
            }
        }
    })
})

router.get('/events',(req,res)=>{
    let events =[
        {
            "id" : "1",
            "name" : "auto expo",
            "description" : "lorem Ipsum",
            "date" : "2012-04-23T18:25:43:511Z"
        }
    ]
    res.json(events)
})

router.get('/specials',verifyToken, (req,res)=>{
    let specials =[
        {
            "id" : "1",
            "name" : "special expo",
            "description" : "special Ipsum",
            "date" : "2012-04-23T18:25:43:511Z"
        }
    ]
    res.json(specials)
})

module.exports = router
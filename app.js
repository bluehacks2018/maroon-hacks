const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://user:password@ds117148.mlab.com:17148/bluehacks')

const Employer = mongoose.model('Employer', {
    firstName: String,
    middleInitial: String,
    lastName: String,
    contactNumber: String,
    email: String,
    password: String,
    streetAddress: String,
    city: String,
    region: String
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('ashd'))
app.post('/', (req, res) => {
    console.log(req.body.msg)
    res.send(req.body)
})

app.post('/employers', (req, res) => {
    const employer = new Employer({
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        email: req.body.email,
        password: req.body.password,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        region: req.body.region
    })

    employer.save().then(() => res.send({
        "msg": "Employer successfully registered.",
        "data": employer
    }))
})

app.listen(3001, () => console.log('Example app listening on port 3001!'))

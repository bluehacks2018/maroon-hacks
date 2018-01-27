const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://user:password@ds117148.mlab.com:17148/bluehacks')

const Employer = mongoose.model('Employer', {
    firstName: String,
    middleInitial: String,
    lastName: String,
    contactNumber: { type: String, unique: true },
    email: String,
    pin: String,
    streetAddress: String,
    city: String,
    verified: Boolean
})

// Jobs:
//     Karpintero
//     Elektrisista
//     Kasambahay
//     Taga-alaga
//     Tsuper
//     Kusinero
//     Masonero
//     Mekaniko
//     Tubero

const Worker = mongoose.model('Worker', {
    firstName: String,
    middleInitial: String,
    lastName: String,
    contactNumber: { type: String, unique: true },
    email: String,
    pin: String,
    streetAddress: String,
    city: String,
    job: String,
    verified: Boolean
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.render('search');
});

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.get('/verify', function(req, res) {
    res.render('verify');
});

app.post('/signup', function(req, res) {
    res.send(req.body);
});

app.post('/', (req, res) => {
    console.log(req.body.inboundSMSMessageList.inboundSMSMessage)
    res.send(req.body)
})

app.post('/employers', (req, res) => {
    const employer = new Employer({
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        email: req.body.email,
        pin: req.body.pin,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        region: req.body.region,
        verified: false
    })

    employer.save().then(() => res.send({
        "msg": "Employer successfully registered.",
        "success": true
    })).catch(() => res.send({
        "msg": "That number is already registered.",
        "success": false
    }))
})

app.post('/workers', (req, res) => {
    const worker = new Worker({
        firstName: req.body.firstName,
        middleInitial: req.body.middleInitial,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        email: req.body.email,
        pin: req.body.pin,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        region: req.body.region,
        job: req.body.job,
        verified: false
    })

    worker.save().then(() => res.send({
        "msg": "Worker successfully registered.",
        "success": true
    })).catch(() => res.send({
        "msg": "That number is already registered.",
        "success": false
    }))
})

app.patch('/employers', (req, res) => {
    Employer.findOne({ 'contactNumber': req.body.contactNumber }).catch((err) => {
        res.send({
            "msg": "Contact number not found.",
            "success": false
        })
    }).then((employer) => {
        employer.firstName = req.body.firstName || employer.firstName
        employer.middleInitial = req.body.middleInitial || employer.middleInitial
        employer.lastName = req.body.lastName || employer.lastName,
        employer.contactNumber = req.body.contactNumber || employer.contactNumber,
        employer.email = req.body.email || employer.email,
        employer.pin = req.body.pin || employer.pin,
        employer.streetAddress = req.body.streetAddress || employer.streetAddress,
        employer.city = req.body.city || employer.city,
        employer.region = req.body.region || employer.region,
        employer.verified = true

        employer.save()
    }).then(() => res.send({
        "msg": "Employer info successfully updated.",
        "success": true
    }))
})

app.patch('/workers', (req, res) => {
    Worker.findOne({ 'contactNumber': req.body.contactNumber }).catch((err) => {
        res.send({
            "msg": "Contact number not found.",
            "success": false
        })
    }).then((worker) => {
        worker.firstName = req.body.firstName || worker.firstName
        worker.middleInitial = req.body.middleInitial || worker.middleInitial
        worker.lastName = req.body.lastName || worker.lastName,
        worker.contactNumber = req.body.contactNumber || worker.contactNumber,
        worker.email = req.body.email || worker.email,
        worker.pin = req.body.pin || worker.pin,
        worker.streetAddress = req.body.streetAddress || worker.streetAddress,
        worker.city = req.body.city || worker.city,
        worker.region = req.body.region || worker.region,
        worker.job = req.body.job || worker.job,
        worker.verified = true

        worker.save()
    }).then(() => res.send({
        "msg": "Worker info successfully updated.",
        "success": true
    }))
})

app.listen(PORT, () => console.log('Example app listening on port ' + PORT + '!'))

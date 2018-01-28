const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const request = require('request');

const app = express()
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://user:password@ds117148.mlab.com:17148/bluehacks')

const Employer = mongoose.model('Employer', {
    firstName: { type: String, default: '' },
    middleInitial: { type: String, default: '' },
    lastName: { type: String, default: '' },
    contactNumber: { type: String, unique: true },
    email: { type: String, default: '' },
    pin: { type: String, default: '' },
    streetAddress: { type: String, default: '' },
    city: { type: String, default: '' },
    verified: { type: Boolean, default: false }
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
    firstName: { type: String, default: ''},
    middleInitial: { type: String, default: ''},
    lastName: { type: String, default: ''},
    contactNumber: { type: String, unique: true },
    email: { type: String, default: ''},
    pin: { type: String, default: ''},
    streetAddress: { type: String, default: ''},
    city: { type: String, default: ''},
    job: { type: String, default: ''},
    comments: [{ type: String }],
    verified: { type: Boolean, default: false}
})

const access_tokens = {
    '09064612583': '25tr84FFxaPiMue5ySsfTB9-C52VYxyWtJ4Ek0Q5HJs',
    '09178837455': 'gluU4ok_ruydxWSmQzPWvCaZLHIRv0rXVTm-3GCk2eY'
}

function send_message(message, number) {
    var url = 'https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/5133/requests?access_token=' + access_tokens[number];
    request.post(
        url,
        { form: { address: number, message: message} },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}

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

app.post('/verify', function(req, res) {
    message_to_send = 'Ang iyong account ay naverify na. ';
    send_message(message_to_send, req.body.contactNumber);
    res.redirect('/');
})

app.post('/signup', function(req, res) {
    res.send(req.body);
});

app.get('/karpintero', (req, res) => {
    Worker.find({ 'job': 'Karpintero' }).then((carpenters) => {
        res.send({ 'carpenters': carpenters, 'success': true });
    }).catch((err) => {
        res.send({
            'err': err,
            'success': false
        })
    })
})

app.post('/', (req, res) => {
    msg = req.body.inboundSMSMessageList.inboundSMSMessage[0].message
    number = req.body.inboundSMSMessageList.inboundSMSMessage[0].senderAddress
    msg = msg.split(" ")
    console.log(msg)

    if (msg[0] === "REG1") {
        const worker = new Worker({
            firstName: msg[1],
            middleInitial: msg[2],
            lastName: msg[3],
            contactNumber: '0' + number.substring(number.length - 10),
            pin: msg[4],
            streetAddress: '',
            job: msg[5],
            verified: false
        })

        worker.save().then(() => {
            message_to_send = 'Natanggap na namin ang iyong mga detalye, ' + worker.firstName +'. Pumunta sa pinakamalapit na booth upang magpa-verify. Magdala ng balidong ID para dito. Salamat!';
            send_message(message_to_send, worker.contactNumber);
            res.send({
                "msg": "Employer successfully registered.",
                "success": true
            });
        }).catch(() => res.send({
            "msg": "That number is already registered.",
            "success": false
        }))
    } else if (msg[0] === "REG2") {
        const employer = new Employer({
            firstName: msg[1],
            middleInitial: msg[2],
            lastName: msg[3],
            contactNumber: '0' + number.substring(number.length - 10),
            pin: msg[4],
            streetAddress: '',
            verified: false
        })

        employer.save().then(() => {
            message_to_send = 'Natanggap na namin ang iyong mga detalye, ' + employer.firstName +'. Pumunta sa pinakamalapit na booth upang magpa-verify. Magdala ng balidong ID para dito. Salamat!';
            send_message(message_to_send, employer.contactNumber);
            res.send({
                "msg": "Employer successfully registered.",
                "success": true
            });
        }).catch(() => res.send({
            "msg": "That number is already registered.",
            "success": false
        }))
    } else if (msg[0] === "FIND") {
        Worker.find({ 'job': msg[1] }).then((workers) => {
            message_to_send = ''

            for (var i = 0; i < workers.length; i++) {
                if (i === 3) {
                    break
                }
                message_to_send = message_to_send +  workers[i].firstName + ' ' + workers[i].middleInitial + ' ' + workers[i].lastName + ' ' + workers[i].contactNumber + ' ' + workers[i].city + '\n'
            }

            send_message(message_to_send, '0' + number.substring(number.length - 10));
            res.send({
                data: workers,
                success: true
            })
        }).catch((err) => {
            res.send({
                msg: 'There was an error in finding a ' + msg[1] + ', please try again.',
                success: false
            })
        })
    } else if (msg[0] === "REVIEW") {
        comment = ''

        for (var i = 2; i < msg.length; i++) {
            comment = comment + msg[i] + ' '
        }

        Worker.findOne({ 'contactNumber': msg[1] }).then((worker) => {
            worker.comments.push(comment)
            worker.save()
        }).then((worker) => {
            message_to_send = 'Salamat sa pagbibigay ng review!';
            send_message(message_to_send, '0' + number.substring(number.length - 10));
        }).then(() => {
            res.send({
                msg: "Your review has been added.",
                success: true
            })
        }).catch((err) => {
            res.send({
                msg: 'There was an error in reviewing ' + msg[1] + ', please try again.',
                success: false
            })
        })
        res.send({
            msg: 'REVIEW',
            success: true
        })
    } else {
        res.send({
            msg: 'Format is not valid.',
            success: false
        })
    }

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
        worker.job = req.body.job || worker.job,
        worker.verified = true

        worker.save()
    }).then(() => res.send({
        "msg": "Worker info successfully updated.",
        "success": true
    }))
})

app.listen(PORT, () => console.log('Example app listening on port ' + PORT + '!'))

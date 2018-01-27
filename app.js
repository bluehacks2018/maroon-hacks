const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('ashd'))
app.post('/', (req, res) => {
    console.log(req.body.inboundSMSMessageList.inboundSMSMessage)
    res.send(req.body)
})

app.listen(PORT, () => console.log('Example app listening on port 3001!'))

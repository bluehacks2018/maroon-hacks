const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('ashd'))
app.post('/', (req, res) => {
    console.log(req.body.msg)
    res.send(req.body)
})

app.listen(3001, () => console.log('Example app listening on port 3001!'))

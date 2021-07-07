const app = require('express')()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./model/user')
const cors = require('cors')

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

const connected = async () => {
    try {
        const db = await mongoose.connect(process.env.DB,{useNewUrlParser: true, useUnifiedTopology: true})
    db ? app.listen(process.env.PORT, () => {
        console.log('connected')
    }) : console.log('not connected yet')
    } catch (err) {
        console.log(err)
    }
}

// app.post('/addUser', async (req, res) => {
//     const data = req.body
//     try {
//         const password = await bcrypt.hash(data.password, 10)
//         const user = await User.create({
//             username: data.username,
//             password: password,
//             hobby: data.hobby
//         })
//         console.log(user)
//         // const result = user
//         res.send({
//              message: 'success',
//                 data: {
//                     username: data.username,
//                     hobby: data.username
//                 }
//          })
//     } catch (err) {
//         console.log(err)
//     }
// })

app.post('/login', async (req, res) => {
    const data = req.body
    const user = await User.findOne({username: data.username})
    const result = await bcrypt.compare(data.password,user.password)
    result ? res.status(200).send({
        message: 'success',
            data: {
                username: user.username,
                hobby: user.hobby
            }
    }) : res.status(401).send({message: 'failed'})
})

connected()

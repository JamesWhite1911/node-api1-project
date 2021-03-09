// BUILD YOUR SERVER HERE

const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

//C
//POST, lets you send a request body
server.post('/api/users/', (req, res) => {
    const newUser = req.body

    User.insert(newUser)
        .then(user => {
            res.json(user)
        })
})

//R
//GET, lets you see the users
server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.status(200).json({ message: 'Users! ', users })
    })
})

//R continued
//GET, lets you see a user
server.get('/api/user:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            res.json(user)
        })
})

//U
//PUT, lets you update a user
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body
    try {
        const updatedUser = await User.update(id, changes)
        res.json(updatedUser)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//D
//DELETE, lets you delete a user
server.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await User.remove(req.params.id)
        res.json("deleted user: ", deleted)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//catch-all for undefined routes
server.use('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found' })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}

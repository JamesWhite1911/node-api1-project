//imports
const express = require('express')
const User = require('./users/model')

//server
const server = express()
server.use(express.json())

//C
//POST, lets you send a request body
server.post('/api/users/', (req, res) => {
    const newUser = req.body
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        User.insert(newUser)
            .then(user => {
                res.status(201).json(user, user.id)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" })
            })
    }
})

//R
//GET, lets you see the users
server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json({ message: 'Users! ', users })
        })
        .catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})

//R continued
//GET, lets you see a user
server.get('/api/user:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }
            else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

//U
//PUT, lets you update a user
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body
    try {
        if (!changes.name || !changes.bio) {
            res.status(400).json({ message: "The user with the specified ID does not exist" })
        } else {
            const updatedUser = await User.update(id, changes)
            if (!updatedUser) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }
            else {
                res.status(200).json(updatedUser)
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The user information could not be modified" })
    }
})

//D
//DELETE, lets you delete a user
server.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await User.remove(req.params.id)
        if (!deleted) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
        else {
            res.json("deleted user: ", deleted)
        }
    } catch (err) {
        res.status(500).json({ message: "The user could not be removed" })
    }
})

//catch-all for undefined routes
server.use('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found' })
})

module.exports = server;

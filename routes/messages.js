const express = require('express');
const messageRouter = express.Router();
const Message = require('../models/Message');

// Fetch
messageRouter.get('/', (req, res) => {
    // Message.find()
    //     .then(data => {
    //         res.json(data);
    //     })
    //     .catch(err => {
    //         res.json({ message: err })
    //     })
    res.json({ data: "hai" });
})

// Fetch specific
messageRouter.get('/:messageId', (req, res) => {
    Message.findById(req.params.messageId)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.json({ message: err })
        })
})

// Add
messageRouter.post('/add', (req, res) => {
    const message = new Message({
        title: req.body.title,
        content: req.body.content,
        type: req.body.type
    });
    message.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.json({ message: err })
        })
})

//Update

messageRouter.patch('/:messageId', async (req, res) => {
    try {
        const updatedMessage = await Message.updateOne(
            { _id: req.params.messageId },
            {
                $set: { title: req.body.title }
            });
        res.status(200).json(updatedMessage);
    } catch (err) {
        res.json({ message: err })
    }
})

messageRouter.put('/:messageId', (req, res) => {
    return Message.updateOne(
        { _id: req.params.messageId },
        {
            $set: {
                title: req.body.title,
                content: req.body.content,
                type: req.body.type
            }
        }
    ).then(result =>
        res.status(200).json(result))
        .catch(err => {
            res.status(404).json({ message: err })
        })
})
// Delete

messageRouter.delete('/:messageId', async (req, res) => {
    try {
        const removedMessage = await Message.remove({ _id: req.params.messageId });
        res.status(200).json(removedMessage)
    } catch (err) {
        res.json({ message: err })
    }

})

module.exports = messageRouter;
const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
    type: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
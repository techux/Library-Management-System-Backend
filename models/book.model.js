const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed'],
        default: 'Available'
    },
    thumbnail: {
        type: String,
        required: true
    },
    bookLink: {
        type: String,
        required: true,
        default: "/assets/book.png"
    }
},{
    timestamps: true,
    versionKey: false
})

const Book = mongoose.model('book', bookSchema);

module.exports = Book
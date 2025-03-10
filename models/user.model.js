const { validate } = require('email-validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: e => validate(e),
            message: props => `${props.value} is not a valid email!`
        }        
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['librarian', 'member'],
        default: 'member'
    },
    mybooks: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'book'
    },
    bookHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'book'
    }
},
{
    timestamps: true,
    versionKey: false
})


const User = mongoose.model("user", userSchema);

module.exports = User;
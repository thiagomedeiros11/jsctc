// Loading Modules

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Model
const Customer = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

// Collection
mongoose.model("customers", Customer)

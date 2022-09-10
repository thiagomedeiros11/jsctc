// Loading Modules

    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require('mongoose')
    const session = require("express-session")
    const flash = require("connect-flash")

// Configuration

    // Session
    app.use(session({
        secret: "clicktocall",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    
    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // Body-Parser 
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    // Handlebars 
    app.engine('handlebars',handlebars.engine({defaulyLayout:'main'})) 
    app.set('view engine', 'handlebars');

    // Mongoose
        mongoose.connect("mongodb://127.0.0.1/clicktocall").then(() => {
            console.log("Connected to MongoDB.")
        }).catch((err) => {
            console.log("Error connecting."+err)
        })

    // Public
        app.use(express.static(path.join(__dirname,"public")))

// Routes
    app.use('/clicktocall', admin)

// Server
const PORT = 8081
app.listen(PORT,() => {
    console.log("Server running!")
})


const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Customer")
const Customer = mongoose.model("customers")
const bodyParser = require("body-parser")
const { application } = require("express")
const axios = require('axios');


router.get('/', (req, res) => {
    res.redirect("/clicktocall/customers")
})

router.get('/customers', (req, res) => {
    Customer.find().sort({date: 'desc'}).limit(3).then((customers) => {
        res.render("admin/customers", {customers: customers.map(customers => customers.toJSON())})
    }).catch((err) => {
        req.flash("error_msg", "Error listing the customers")
        res.redirect("/admin")
    })

})

router.get('/registration', (req, res) => {
    res.render("admin/registration")
})

router.post('/registration/new', (req, res) => {

    var errors = [] 

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: "The name field is required"})
    }

    if(!req.body.phone || typeof req.body.phone == undefined || req.body.phone == null){
        errors.push({text: "The phone number field is required"})
    }

    if(req.body.name.length < 3){
        errors.push({text: "To short name, minimum of 3 characters"})
    }

    if(errors.length > 0){
        res.render("admin/registration", {errors: errors})
    }else{
        const newCustomer = {
            name: req.body.name,
            phone: req.body.phone
        }

        new Customer(newCustomer).save().then(() => {
            req.flash('success_msg', "Customer created sucessfully")
            console.log("Customer created successfully")
            res.redirect("/clicktocall/registration")
        }).catch((err) => {
            req.flash('error_msg', "Error creating customer")
            console.log("Error creating customer")
            res.redirect("/clicktocall/registration")
        })
    }
})

router.get("/customers/edit/:id", (req, res) => {
    Customer.findOne({_id: req.params.id}).lean().then((customers) => {
        res.render("admin/editcustomers", {customers: customers})
    }).catch((err) => {
        req.flash("error_msg", "Error editing the customer")
        res.redirect("/clicktocall/customers")
    })
})

router.post("/customers/edit/", (req, res) => {

    Customer.findOne({_id: req.body.id}).then((customer) => {

        customer.name = req.body.name
        customer.phone = req.body.phone

        customer.save().then(() => {
            req.flash("success_msg", "Customer updated successfully")
            res.redirect("/clicktocall/customers")
        }).catch((err) => {
            req.flash("error_msg", "Error updating customer")
            res.redirect("/clicktocall/customers")
        })
    
    }).catch((err) => {
        req.flash("error_msg", "Error trying to update")
        res.redirect("/clicktocall/customers")
    })

})

router.post("/customers/delete", (req, res) => {
    Customer.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Customer successfully deleted")
        res.redirect("/clicktocall/customers")
    }).catch((err) => {
        req.flash("error_msg", "Failed to delete client")
        req.redirect("/clicktocall/customers")
    })
 
})

router.post("/customers/search", (req, res) => {
    var errors = [] 

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: "The search field is required"})
    }
    if(errors.length > 0){
        res.render("admin/search", {errors: errors})
    }else{
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
          }
        Customer.findOne({name: new RegExp(escapeRegExp(req.body.name))}).then((thiago) => {
            console.log(thiago)
            // thiago.name = req.body.name
            req.flash("success_msg", "search test")
            res.render("admin/search", {thiago:thiago})
        }).catch((err) => {
            req.flash("error_msg", "search failed")
            res.redirect("/clicktocall/customers")
        })
    }
})    

router.get("/customers/call/:phone", (req, res) => {
	var phone = (req.params.phone)
	Customer.findOne({_phone: req.params.phone}).lean().then((customer) => {
        (async () => {
            try {
		    const response = await axios.get('http://app.nuvemfone.com.br/nf-api/v10/clicktocall.php?origem=<your-sip-exten>&destino='+(req.params.phone)+'&keyaction=<your-keyaction>')
		    console.log(response)
		    console.log(req.params.phone)
		    req.flash("success_msg", "Call made successfully")
		    res.redirect("/clicktocall/customers")
            } catch (error) {
                console.log(error.response)
		req.flash("error_msg", "Phone call failed")
		res.redirect("/clicktocall/customers")
            }
        })()
})})    

module.exports = router

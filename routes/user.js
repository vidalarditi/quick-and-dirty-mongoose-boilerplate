const express = require("express")
const app = express()
const User = require("../models/user")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

app.get("/user/signup", (req, res)=> {
    res.render("signup")
})

app.post("/user/signup", (req, res)=> {
    let newUser = {
        username: req.body.username,
        email: req.body.email,
    }
    debugger
    User.find({username: req.body.username})
        .then((user)=> {
            if(user.length > 0) {
                res.send("user already exists")
            } else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    // Store hash in your password DB.
                    debugger
                    if(err) throw new Error("hashing error")
                    else {
                        newUser.password = hash
                        User.create(newUser)
                        .then((user)=> {
                            res.send("ok")
                        })
                    }
                  });
            }
        })
        .catch((err)=> {
            res.status(500).send("An error occured")
        })

})

app.get("/user/login", (req, res)=> {
    res.render("login")
})

app.get("/user/logout", (req, res)=> {
    // res.clearCookie("loggedIn")
    req.session.destroy((err)=> {
        if(err) res.redirect("/")
        else res.redirect("/user/login")
    })
   
})

app.post("/user/login", (req, res)=> {
    User.find({username: req.body.username})
        .then((user)=> {
            if(user.length > 0) {
                bcrypt.compare(req.body.password, user[0].password, function(err, equal) {
                    if(equal) {
                            delete user[0].password
                        req.session.currentUser = user[0];
                        // res.cookie("loggedIn", "true", {signed: true})
                        res.send("logged in")
                    }
                    else {
                        res.send("Invalid credentials")
                    }
                })
            } else {
                res.send("Invalid credentials")
            }

        })
        .catch((err)=> {
            res.status(500).send("an error occured")
        })
})
module.exports = app
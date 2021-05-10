const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req,res) =>{
    res.render("register");
})

router.post("/register", async(req, res) => {
    try{
    const{username, password} = req.body;
    const newU = new User({username});
    const regUser = await User.register(newU, password);
    req.login(regUser, err => {
        if(err) return next(err);
        res.redirect("/images");
    })
    } catch(e){
        res.redirect("/register")
    }
   
});

router.get("/login", (req,res) => {
    res.render("login");
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
    const redirectUrl = req.session.returnTo || "/images";
    delete req.session.returnTo;
    res.redirect("/images");
})

router.get("/logout", (req,res) => {
    req.logout()
    res.redirect("/images");
})

module.exports = router;
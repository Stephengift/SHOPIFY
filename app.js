const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Image = require("./models/image");
const users = require("./routes/user");
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
const sessionConfiguration = {
	secret :"asecret",
	resave: false,
	saveUninitialized: true,
	cookie:{
		httpOnly: true,
		expires: Date.now() + 1000 * 3600 * 336,
		maxAge : 1000 * 3600 * 336,
	}
}
app.use(session(sessionConfiguration));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    next();
})

app.use("/", users)


app.get("/images", async (req,res)=>{
    const images = await Image.find({});
    res.render("index", {images})
})


app.get("/images/new", (req,res)=>{
    if(!req.isAuthenticated()){
        res.redirect("/login");
    }else{
        res.render("new");
    }
});

app.get("/images/:id", async(req,res) =>{
    const image = await Image.findById(req.params.id).populate("owner");
    res.render("show", {image});
})

app.post("/images/new", async(req,res)=>{
    const image = new Image(req.body.image);
    image.owner = req.user._id;
    await image.save();
    res.redirect(`/images/${image._id}`)
})

app.delete("/images/:id", async(req,res)=>{
    await Image.findByIdAndDelete(req.params.id);
    res.redirect("/images");

})

mongoose.connect("mongodb://localhost/imagesdb", (err) =>{
	if(err){
		throw err
	}
	app.listen(3000, () => {
	console.log("Server is listening");})
});
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const Listing = require('./models/listing')

const listingRouter = require('./routes/listing')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')

const dbUrl = process.env.ATLASDB_URL

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err); 
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.set("view engine", "ejs")
app.engine('ejs', ejsMate)
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended : true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))

main()
.then(() => {
    console.log("Connecting to DB");
})
.catch((err) => {
    console.log("Some error occur", err);
})

async function main () {
    await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
    console.log("Server is listening at port 8080");
})

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)
app.get("/search", async (req, res) => {
    let location = req.query;
    let listing = await Listing.find({location: location.value});
    let id = listing[0]._id;
    listing = await Listing.findById(id).populate({ 
        path: "reviews", 
        populate: {
            path: "author"
        } })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
})

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!!" } = err;
    res.status(statusCode).render("Error.ejs", { message })
})
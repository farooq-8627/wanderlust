if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;
async function main() {
	await mongoose.connect(dbUrl);
}
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode"));

const store = MongoStore.create({
	mongoUrl: dbUrl,
	crypto: {
		secret: secret,
	},
	touchAfter: 24 * 3600,
});
store.on("error", (err) => {
	console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
	store,
	secret: secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true,
	},
};

app.get("/", (req, res) => {
	res.redirect("/listing");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	res.locals.login = req.originalUrl;
	next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
	let { status = 500, message = "Error Occured" } = err;
	console.log(err);
	res.status(status).render("error.ejs", { err });
});

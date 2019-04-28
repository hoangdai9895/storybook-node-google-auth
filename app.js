const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// load hanlebar helper
const hdb = require("./helpers/hbd");
// load Route
const stories = require("./routes/stories");
const auth = require("./routes/auth");
const index = require("./routes/index");

// passport config
require("./config/passport")(passport);

// map global promies
mongoose.Promise = global.Promise;

// mongoose connect
mongoose
    .connect(keys.mongoURI)
    .then(() => console.log("MongoDB connected!!"))
    .catch(err => console.log("aa" + err));

const app = express();

// hanlebars helpers
const {
    truncate,
    scriptTags,
    formatDate,
    select,
    editIcon
} = require("./helpers/hbd");

// method override
app.use(methodOverride("_method"));

// body parser middlaware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.engine(
    "handlebars",
    exphbs({
        helpers: {
            truncate,
            scriptTags: scriptTags,
            formatDate,
            select,
            editIcon
        },
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false
    })
);
// passport middleawe;
app.use(passport.initialize());
app.use(passport.session());

// set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Route
app.use("/stories", stories);
app.use("/", index);
app.use("/auth", auth);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
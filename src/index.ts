import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
const cors = require("cors");
const passport = require("passport");
const session = require("express-session")
const PORT: number = 8080;
require("dotenv").config();
const { samlStrat } = require("./auth/saml");

passport.serializeUser((user:any, done:any) => {
    done(null, user);
});

passport.deserializeUser((user:any, done:any) => {
    done(null, user);
});

const app:Express = express();
app.use(helmet());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SAML_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
passport.use(samlStrat);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

const jsonParser = bodyParser.json();

const authRoute = express.Router();
require('./routes/auth')(authRoute, passport, bodyParser, samlStrat);
app.use('/',authRoute);

app.listen(PORT, async() => {
    console.log(`app listening on port ${PORT}`)
})
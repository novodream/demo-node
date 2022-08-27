import express from 'express';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import {Movie} from "./movies.schema.js";
import {checkJwt} from "./auth.js";
import {requiredScopes} from "express-oauth2-jwt-bearer";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_MAIL_API_KEY);

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

app.get('/movies', checkJwt, requiredScopes('read:movies'), async (req, res) => {
    const movies = await Movie.find({});
    res.send(movies);
});

app.post('/movies', checkJwt, requiredScopes('create:movies'), async (req, res) => {
    const {title, year, rating} = req.body;
    const movie = new Movie({title, year, rating});
    await movie.save();
    res.send({id: movie.id});
});

app.put('/movies/:id', checkJwt, requiredScopes('update:movies'), async (req, res) => {
    const {id} = req.params;
    const {title, year, rating} = req.body;
    const movie = await Movie.findByIdAndUpdate(id, {title, year, rating}, {new: true});

    res.send(movie);
});

app.delete('/movies/:id', checkJwt, requiredScopes('delete:movies'), async (req, res) => {
    const {id} = req.params;
    await Movie.findByIdAndDelete(id);

    res.send({})
});

app.post('/mail', checkJwt, requiredScopes('send:mail'), async (req, res) => {
    const {email, message} = req.body;
    
    await sgMail.send({
        to: email,
        from: 'demonode.dream@novopattern.com',
        subject: 'Hello from Demo Node of DReAM',
        text: message
    });

    res.send({});
});

(async () => {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();



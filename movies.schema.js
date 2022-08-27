import mongoose from "mongoose";

export const Movie = mongoose.model("Movie", new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
    }
}, {
    toJSON: {
        virtuals: true
    }
}));

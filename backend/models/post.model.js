import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {type: String, default:''},
    image: {type: String, required: true}, 
    author: {type: mongoose.Schema.ObjectId, ref:'User'}, 
    likes: [{type: mongoose.Schema.ObjectId}],
    comments: [{type: mongoose.Schema.ObjectId, ref:'Comment'}] 
},{timestamps:true});

export const Post = mongoose.model('Post', postSchema);
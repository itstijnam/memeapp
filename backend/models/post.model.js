import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {type: String, default:''},
    image: {type: String, required: true}, 
    author: {type: mongoose.Schema.ObjectId, ref:'User'}, 
    likes: [{type: mongoose.Schema.ObjectId}],
    // post likes means user id will insert into it and it means to increase the length of array
    // so the wich has maximum lenth it means that post is being liked most and trending.
    comments: [{type: mongoose.Schema.ObjectId, ref:'Comment'}] 
},{timestamps:true});

export const Post = mongoose.model('Post', postSchema);
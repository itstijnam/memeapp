import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import {Comment} from '../models/comment.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file; // Get uploaded file
        const authorId = req.id; // Get user ID from middleware

        if (!image) {
            return res.status(400).json({
                message: 'No image uploaded',
                success: false
            });
        }

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                success: false
            });
        }

        // Resize and optimize the uploaded image using sharp
        const uploadDir = path.join(__dirname, '../uploads', `${user.username}post`);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const outputFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
        const outputPath = path.join(uploadDir, outputFileName);

        await sharp(image.path)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpg', { quality: 80 })
            .toFile(outputPath);
            
        // Construct the full URL
        const baseURL = "http://localhost:3000"; // Update this to your actual domain if hosted
        const relativePath = path.join('uploads', `${user.username}post`, outputFileName).replace(/\\/g, '/');
        const fullURL = `${baseURL}/${relativePath}`;

        // Save the post to the database
        const post = await Post.create({
            caption,
            image: fullURL, // Save full URL
            author: authorId
        });

        user.posts.push(post._id);
        await user.save();
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post created',
            post,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


export const getAllPost = async (req, res)=>{
    try {
        const post = await Post.find().sort({createdAt: -1})
        .populate({path:'author', select:'username profilePicture'})
        .populate({
            path: 'comments',
            sort:{createdAt: -1},
            populate:{
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            post,
            success:true 
        })
    } catch (error) {
        console.log(error)
    }
};

export const getUserPost = async (req, res)=>{
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId}).sort({createdAt: -1})
        .populate({path:'author', select:'username, profilePicture'})
        .populate({
            path: 'comments',
            sort:{createdAt: -1},
            populate:{
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success:true 
        })
    } catch (error) {
        console.log(error)
    }
};

export const likePost = async (req,res)=>{
    try {
        const likeKarneWaaleUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: 'Post not found', success:false});

        // like logic started
        await post.updateOne({$addToSet:{likes: likeKarneWaaleUserkiId}})
        await post.save()

        // socket.io will be here for notification

        return res.status(200).json({
            message: 'Post Liked',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const dislikePost = async (req,res)=>{
    try {
        const likeKarneWaaleUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: 'Post not found', success:false});

        // dislike logic started
        await post.updateOne({$pull:{likes: likeKarneWaaleUserkiId}})
        await post.save()

        // socket.io will be here for notification

        return res.status(200).json({
            message: 'Post disliked',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async (req,res)=>{
    try {
        const postId = req.params.id;
        const commentWaaleKiId = req.id;

        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Something went wrong', success:false})
        if(!text) return res.status(400).json({message:'message required', success:false})
        
        const comment = await Comment.create({
            text,
            author:commentWaaleKiId,
            post:postId
        })

        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment Added',
            comment,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getCommentsOfPost = async (req, res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).populate('author', 'username profilePicture');
        if(!comments) return res.status(404).json({message: 'No comments are found', success: false});
        return res.status(200).json({success: true, comments});
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (req, res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: 'post not found', success: false});

        // check if the logged in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({message: 'unauthorized'})
        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId); 
        await user.save();

        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message: 'Post Deleted',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const bookmarksPost =  async (req, res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post =  await Post.findById(postId);
        if(!post) return res.status(404).json({message: 'post not found', success: false});

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success: true});
        }else{
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success: true});
        }
    } catch (error) {
        console.log(error)
    }
}
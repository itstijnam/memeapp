import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getRecieverSocketId, io } from '../socket/socket.js';
import cloudinary from '../utils/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

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

        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width: 800, height:800, fit: 'inside'})
        .toFormat('jpeg', {quality:80})
        .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
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


export const getAllPost = async (req, res) => {
    try {
        const {dataFilter} = req.body;
        const post = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            post,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username, profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const likePost = async (req, res) => {
    try {
        const likeKarneWaaleUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $addToSet: { likes: likeKarneWaaleUserkiId } })
        await post.save()

        const user = await User.findById(likeKarneWaaleUserkiId).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKarneWaaleUserkiId){
            const notification = {
                type: 'like',
                userId: likeKarneWaaleUserkiId,
                userDetails: user,
                message: 'Your post was liked'
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId)
            io.to(postOwnerSocketId).emit('notification', notification)
        }


        return res.status(200).json({
            message: 'Post Liked',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const dislikePost = async (req, res) => {
    try {
        const likeKarneWaaleUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // dislike logic started
        await post.updateOne({ $pull: { likes: likeKarneWaaleUserkiId } })
        await post.save()

        // socket.io will be here for notification
        const user = await User.findById(likeKarneWaaleUserkiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKarneWaaleUserkiId) {
            const notification = {
                type: 'dislike',
                userId: likeKarneWaaleUserkiId,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }
        return res.status(200).json({
            message: 'Post disliked',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentWaaleKiId = req.id;

        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Something went wrong', success: false })
        if (!text) return res.status(400).json({ message: 'message required', success: false })

        const comment = await Comment.create({
            text,
            author: commentWaaleKiId,
            post: postId
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
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');
        if (!comments) return res.status(404).json({ message: 'No comments are found', success: false });
        return res.status(200).json({ success: true, comments });
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found', success: false });

        // check if the logged in user is the owner of the post
        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'unauthorized' })
        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: 'Post Deleted',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
};

export const bookmarksPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found', success: false });

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
        }
    } catch (error) {
        console.log(error)
    }
}
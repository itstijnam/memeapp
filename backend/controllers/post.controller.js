import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Post } from '../models/post.model.js';
import { User } from '../models/User.model.js';

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
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileExt = '.jpg';
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const userPostFolder = path.resolve(__dirname, '..', 'uploads', `${user.username}post`);

        if (!fs.existsSync(userPostFolder)) {
            fs.mkdirSync(userPostFolder, { recursive: true });
        }

        const filePath = path.join(userPostFolder, filename);
        fs.writeFileSync(filePath, optimizedImageBuffer);

        const imagePath = path.join('uploads', `${user.username}post`, filename);
        const post = await Post.create({
            caption,
            image: imagePath,
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
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


export const getAllPost = (req, res)=>{
    try {
        
    } catch (error) {
        console.log(error)
    }
}
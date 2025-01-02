import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


export const register = async (req, res)=>{
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message: "Something is missing, Please check!",
                success: false
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message: 'Try Different Email',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: 'Account has been created successfully',
            success: true
        });
    } catch (error) {
        console.log(`Error :: controller :: user.controller :: register :: error: ${error}`);
    }
}

export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email, !password){
            return res.status(401).json({
                message: 'Either email or password is missing',
                success: false
            })
        }
        let user = await User.findOne({email});
        // yhaa hame user ka entire data mil chuka h including his/her all sensitive information
        if(!user){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message: 'Incorrect email or password',
                success: false
            })
        }

        // yhaa hum user ka data redefine kar rahe aur ensure kar rahe ki uski sensitive information
        // n jaa paaye
        // only woh data jaaye jo ek user ko dikhna chahiye bas
        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:user.posts
        }

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'})
        console.log(token);
        return res.cookie('token', token, {httpOnly: true, sameSite: 'strict', maxAge: 1*24*60*60*1000}).json({
            message: `Welcome ${user.username}`,
            success: true,
            user
        });
        
    } catch (error) {
        console.log(`Error :: controller :: user.controller :: login :: error: ${error}`);
    }
};

export const logout = async (_,res)=>{
    try {
        return res.cookie('token', '', {maxAge: 0}).json({
            message: 'Logged Out successfully',
            success: true
        })
    } catch (error) {
        console.log(`Error :: controller :: user.controller :: logout :: error: ${error}`);
    }
}

export const getProfile = async(req,res)=>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(`Error :: controller :: user.controller :: getProfile :: error: ${error}`);
    }
}

export const editProfile = async(req, res)=>{
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: 'User not found',
                success:false
            })
        }
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) {
            user.profilePicture = `/uploads/${profilePicture.filename}`; // Save file path
        }

        await user.save();
        return res.status(200).json({
            message: 'Profile Updated',
            success: true,
            user
        })

    } catch (error) {
        console.log(`Error :: controller :: user.controller :: editProfile :: error: ${error}`);
    }
}

export const getSuggestedUsers = async (req, res)=>{
    try {
        const suggestedUsers = await User.findById({_id:{$ne:req.id}}).select('-password');
        if(!suggestedUsers){
            return res.status(400).json({
                message: 'Cuurently do not have any users',
            })
        };
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log(`Error :: controller :: user.controller :: getSuggestedUsers :: error: ${error}`);
    }
}

export const followerOrUnfollow = async (req,res)=>{
    try {
        const followKarneWaala = req.id // mtlb main
        const jiskoFollowKarunga =  req.params.id //jo follow hoga

        if(followKarneWaala === jiskoFollowKarunga){
            return res.status(400).json({
                message: `You can't follow yourself account`,
                success: false
            })
        }

        const user = await User.findById(followKarneWaala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if(!user || !targetUser){
            return res.status(400).json({
                message: 'User not found',
                success:false
            })
        }

        const isFollowing = user.following.includes(jiskoFollowKarunga);
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id: followKarneWaala}, {$pull:{following: jiskoFollowKarunga}}),
                User.updateOne({_id: jiskoFollowKarunga}, {$pull:{followers: followKarneWaala}})
            ])
            return res.status(200).json({
                message: 'Unfollowed successful',
                success: true
            })
        }else{
            await Promise.all([
                User.updateOne({_id: followKarneWaala}, {$push:{following: jiskoFollowKarunga}}),
                User.updateOne({_id: jiskoFollowKarunga}, {$push:{followers: followKarneWaala}})
            ])
            return res.status(200).json({
                message: 'Followed successful',
                success: true
            })
        }

    } catch (error) {
        console.log(error);
    }
}
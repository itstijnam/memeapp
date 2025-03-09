import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Button } from './ui/button';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import CommentDialog from './CommentDialog.jsx';
import { motion } from 'framer-motion';
import './css/Post.scss'

function Post({ post }) {
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);

    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
    const [postLikeCount, setPostLikeCount] = useState(post.likes?.length);
    const [comments, setComments] = useState(post.comments || []);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setText(e.target.value.trim());
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://memeapp-4a8f.onrender.com/api/v1/user/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setPosts(posts.filter(postItem => postItem?._id !== post?._id)));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://memeapp-4a8f.onrender.com/api/v1/user/${post._id}/${action}`, { withCredentials: true });

            if (res.data.success) {
                setLiked(!liked);
                setPostLikeCount(liked ? postLikeCount - 1 : postLikeCount + 1);

                const updatedPosts = posts.map(p => p._id === post._id
                    ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [user._id, ...p.likes] }
                    : p
                );
                dispatch(setPosts(updatedPosts));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating like status");
        }
    };

    const commentHandler = async () => {
        if (!text) return;

        try {
            const res = await axios.post(
                `https://memeapp-4a8f.onrender.com/api/v1/user/${post._id}/comment`,
                { text },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            if (res.data.success) {
                const updatedComments = [...comments, res.data.comment];
                setComments(updatedComments);

                const updatedPosts = posts.map(p => p._id === post._id ? { ...p, comments: updatedComments } : p);
                dispatch(setPosts(updatedPosts));
                dispatch(setSelectedPost({ ...post, comments: updatedComments }));

                toast.success(res.data.message);
                setText('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding comment");
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://memeapp-4a8f.onrender.com/api/v1/user/${post._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error bookmarking post");
        }
    };

    return (
        <motion.div
            className="my-8 w-full max-w-sm mx-auto p-5 rounded-xl shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white POST"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.profilePicture} alt="profile_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2 items-center">
                        <h1 className="font-semibold">{post.author.username}</h1>
                        {user?._id === post?.author?._id && <Badge className="bg-yellow-500">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="ghost" className="cursor-pointer w-fit text-red-500 font-bold">Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold">Add to favourites</Button>
                        {user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit font-bold">Delete</Button>}
                    </DialogContent>
                </Dialog>
            </div>

            <motion.img
                src={post?.image}
                alt="post_img"
                className="rounded-lg my-3 w-full object-cover shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            />

            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    <motion.div whileTap={{ scale: 1.2 }}>
                        {liked ? 
                            <FaHeart onClick={likeOrDislikeHandler} size="22px" className="cursor-pointer text-red-500 hover:scale-110 transition" />
                            : <FaRegHeart onClick={likeOrDislikeHandler} size="22px" className="cursor-pointer hover:scale-110 transition" />}
                    </motion.div>
                    <MessageCircle className="cursor-pointer hover:text-blue-400 transition" onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }} />
                    <Send className="cursor-pointer hover:text-green-400 transition" />
                </div>
                <Bookmark className="cursor-pointer hover:text-yellow-400 transition" onClick={bookmarkHandler} />
            </div>

            <span className="font-medium">{postLikeCount} likes</span>
            <p><span className="font-medium mr-2">{post.author.username}</span>{post?.caption}</p>

            <CommentDialog open={open} setOpen={setOpen} post={post} />
        </motion.div>
    );
}

export default Post;

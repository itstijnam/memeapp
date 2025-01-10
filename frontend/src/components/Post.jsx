import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaBeer, FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

function Post({post}) {
    const [text,setText] = useState('');
    const [open, setOpen] = useState(false);
    const {user} = useSelector((store)=> { return store.auth });
    const {posts} = useSelector((store)=> { return store.post });
    const dispatch = useDispatch();

    const changeEventHandler  = (e)=>{
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText)
        }else {
            setText('');
        }
    }

    const deletePostHandler = async ()=>{
        try {
            const res = await axios.delete(`http://localhost:3000/api/v1/user/delete/${post?._id}`, {withCredentials: true})
            if(res.data.success){
                const updatedData = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPosts(updatedData))
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3 '>
                    <Avatar className='PostAvatarContainer bg-gray-50 text-white p-1 rounded-full w-9 h-9 flex justify-center text-center'>
                        <AvatarImage src={post.author.profilePicture} className='PostAuthorPP' alt='profile_image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post.author.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold" >Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold" >Add to favourites</Button>
                        {
                            user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit font-bold" >Delete</Button>
                        }
                        
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post?.image}
                alt="post_img"
            />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3 '>
                    <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle onClick={()=>setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block'>{post.likes.length} likes</span>
            <p className='cursor-pointer'> 
                <span className='font-medium mr-2'>{post.author.username}</span>
                {post?.caption}
            </p>
            <span  onClick={()=>setOpen(true)} className='text-gray-400 text-sm cursor-pointer'>View all 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen} post={post}/>
            <div className='flex items-center justify-between'>
                <input 
                    type="text" 
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span className='text-[#3BADF8] cursor-pointer'>Post</span> 
                }
            </div>
        </div>
    )
}

export default Post
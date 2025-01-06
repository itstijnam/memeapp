import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaBeer, FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'

function Post() {
    const [text,setText] = useState('');
    const changeEventHandler  = (e)=>{
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText)
        }else {
            setText('');
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Avatar className='bg-gray-400 text-white p-1 rounded-full w-9 h-9 flex justify-center text-center'>
                        <AvatarImage src='' alt='profile_image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold" >Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold" >Add to favourites</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold" >Delete</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src="https://images.unsplash.com/photo-1735835593807-575407b39ed7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D"
                alt="post_img"
            />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3 '>
                    <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block'>1k likes</span>
            <p> 
                <span className='font-medium mr-2'>username</span>
                caption
            </p>
            <span className='text-gray-800'>View all 10 comments</span>
            <CommentDialog/>
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
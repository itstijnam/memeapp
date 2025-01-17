import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import { setPosts } from '@/redux/postSlice'
import axios from 'axios'
import { toast } from 'sonner'


function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState();
  const { user } = useSelector((store) => { return store.auth })
  const { selectedPost, posts } = useSelector((store) => store.post)
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch()

  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost.comments);
    }
  }, [selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText("")
    }
  }
  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/user/${selectedPost._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText('')
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <Dialog className='w-96' open={open}>
      <DialogContent className='w-screen' onInteractOutside={() => setOpen(false)}>
        <div className='flex flex-1'>
          <div className='w-96'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='h-96'
            />
          </div>
          <div className='w-96 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar className='flex justify-center items-center' >
                    <AvatarImage src={selectedPost?.author?.profilePicture} className='flex justify-center items-center' />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                  {/* <span></span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to Favourites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4 bg-white border-none'>
              {
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
              }
            </div>
            <div className='p-4 bg-white'>
              <div className='flex items-center gap-2'>
                <input type="text" placeholder='Add a comment...' value={text} onChange={changeEventHandler} className='w-full text-sm outline-none border-gray-300 p-2 rounded' />
                <Button disabled={!text} onClick={sendMessageHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
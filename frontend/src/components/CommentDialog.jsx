import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'

function CommentDialog({ open, setOpen, post }) {
  const [text, setText] = useState();
  const {user} = useSelector((store)=>{return store.auth})
  const changeEventHandler = (e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText)
    }else{
      setText("")
    }
  }
  const sendMessageHandler = ()=>{

  }
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src={post?.image}
              alt="post_img"
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src={post.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>{post.author.username}</Link>
                  {/* <span></span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer'/>
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
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              comments
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" placeholder='Add a comment...' value={text} onChange={changeEventHandler} className='w-full outline-none border-gray-300 p-2 rounded'/>
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
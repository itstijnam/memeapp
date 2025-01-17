import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

function Comment({comment}) {
  return (
    <div className='my-2'>
      <div className='flex gap-3 items-center' >
        <Avatar className='flex justify-center items-center'>
          <AvatarImage src={comment?.author?.profilePicture} className='flex justify-center items-center' alt='author_pic' />
        </Avatar>
        <h1 className='font-bold text-sm' >{comment?.author?.username}<span className='font-normal pl-1 text-gray-600'>{comment?.text}</span></h1>
      </div>
    </div>
  )
}

export default Comment
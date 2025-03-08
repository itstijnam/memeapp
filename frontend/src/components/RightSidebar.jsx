import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

function RightSidebar() {
  const { user } = useSelector(store => store.auth);
  const {darkMode} = useSelector(store => store.darkMode);
  return (
    <div className={`w-fit my-10 pr-36 ${darkMode ? 'darkMode' : ''} `}>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar className='flex justify-center items-center'>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
        </Link>
        <div className=''>
          <h1 className='font-semibold text-sm' ><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || `${user?.username} didn't update their bio yet`}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar
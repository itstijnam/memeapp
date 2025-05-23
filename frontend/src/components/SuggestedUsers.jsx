import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function SuggestedUsers() {
    const { suggestedUsers } = useSelector(store => store.auth)
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm' >
                <h1 className='font-semibold text-gray-600' >Suggested for you</h1>
                <span className='font-medium cursor-pointer' >See All</span>
            </div>
            {
                suggestedUsers?.map((user) => {
                    return (
                        <div key={user?._id} className='flex items-center justify-between my-5' >
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
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]' >Follow</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers
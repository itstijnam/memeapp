import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign } from 'lucide-react';

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const isLoggedInUserProfile = true;
  const isFollowing = true;

  const { userProfile } = useSelector(store => store.auth)
  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5' >
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                  !isLoggedInUserProfile ? (
                    <div className='flex gap-2'>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit Profile</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
                    </div>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='text-white bg-[#0095F6] hover:bg-[#3192d2] h-8'>Unfollow</Button>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>Message</Button>
                      </>
                    ) : (
                      <Button variant='secondary' className='text-white bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>{userProfile?.posts?.length} <span className='font-normal'>posts</span> </p>
                <p className='font-semibold'>{userProfile?.followers?.length} <span className='font-normal'>followers</span> </p>
                <p className='font-semibold'>{userProfile?.following?.length} <span className='font-normal'>following</span> </p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here....'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign className='text-black text-xs' /><span className='pl-1'>{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm text-gray-500'>
            <span className='py-3 cursor-pointer'>POSTS</span>
            <span className='py-3 cursor-pointer'>SAVED</span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
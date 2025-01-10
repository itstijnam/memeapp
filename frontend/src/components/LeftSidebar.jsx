import { setAuthUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'

function LeftSideBar() {
    const navigate = useNavigate();

    const { user } = useSelector((store) => { return store.auth });
    const dispatch = useDispatch();
    const [open, setOpen] = useState();

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null))
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.respone.data.message)
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: 'Home' },
        { icon: <Search />, text: 'Search' },
        { icon: <TrendingUp />, text: 'Explore' },
        { icon: <MessageCircle />, text: 'Messages' },
        { icon: <Heart />, text: 'Notifications' },
        { icon: <PlusSquare />, text: 'Create' },
        {
            icon: (
                <Avatar className='text-red-600 w-9 h-9 rounded-full overflow-hidden border-2 flex justify-center items-center'>
                    <AvatarImage src={user?.profilePicture} className="leftSideProfImg" alt='profile' />
                    <AvatarFallback></AvatarFallback>
                </Avatar>
            ), text: user?.username || 'profile'
        },

        { icon: <LogOut />, text: 'Logout' }
    ]
    
    const sidebarHandler = (textType) => {
        if (textType === 'Logout'){
            logoutHandler();
        } else if(textType === 'Create'){
            setOpen(true);
        }
    }

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='text-center my-8 font-bold text-xl font-serif'>INSTAGRAM</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span> {item.text} </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSideBar
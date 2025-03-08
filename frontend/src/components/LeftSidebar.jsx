import { setAuthUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, SwitchCamera, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost.jsx'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import '../components/css/Home.scss'
import { setDarkMode } from '@/redux/darkModeSlice'


function LeftSideBar() {
    const navigate = useNavigate();

    const { user } = useSelector((store) => { return store.auth });
    const { darkMode } = useSelector((store) => { return store.darkMode });
    const {likeNotification} = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState();
    console.log(darkMode)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts(null));
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.respone.data.message)
        }
    }

    const darkModeEnabler = ()=>{
        dispatch(setDarkMode(!darkMode))
    }


    const sidebarItems = [
        { icon: <Home />, text: 'Home' },
        { icon: <MessageCircle />, text: 'Messages' },
        // { icon: <TrendingUp />, text: 'Explorer' },
        { icon: <PlusSquare />, text: 'Create' },
        { icon: <SwitchCamera />, text: 'Dark mode' },
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
        }else if(textType === `${user?.username}`){
            navigate(`/profile/${user?._id}`)
        }else if(textType === 'Home'){
            navigate('/')
        }else if(textType === 'Messages'){
            navigate('/chat')
        }else if(textType === 'Dark mode'){
            darkModeEnabler();
        }
        // else if(textType === 'Explorer'){
        //     navigate('/meme/expore')
        // }
    }

    return (
        <div className={`fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen ${darkMode ? 'darkMode' : ''}`}>
            <div className='flex flex-col'>
                <h1 className='text-center my-8 font-bold text-xl font-serif text-cyan-500'>T O F O</h1>
                <div>
                    {
                        sidebarItems?.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span> {item.text} </span>
                                    {
                                        item?.text === "Notifications" && likeNotification?.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                        <Button size='icon' className='rounded-full bg-red-600 hover:bg-red-500 h-5 w-5 absolute bottom-6 left-6'>{likeNotification.length} </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification?.length === 0 ? (<p>No new notification</p> ) : (
                                                                likeNotification?.map((notification)=>{
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar className='rounded-full overflow-hidden h-10 w-10' >
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
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
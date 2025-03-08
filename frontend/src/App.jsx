import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoute from './components/ProtectedRoute'
import MemeExplorer from './components/MemeExplorer'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute>  <MainLayout /> </ProtectedRoute>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoute> <Profile /> </ProtectedRoute>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoute> <EditProfile /> </ProtectedRoute>
      },
      {
        path: '/meme/expore',
        element: <ProtectedRoute> <MemeExplorer /> </ProtectedRoute>
      },
      {
        path: '/chat',
        element: <ProtectedRoute> <ChatPage /> </ProtectedRoute>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])

function App() {
  const { user } = useSelector(store => store.auth);
  const {socket} = useSelector(store=> store.socketio);
  const {darkMode} = useSelector(store => store.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification)=>{
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App

import React from 'react';
import Feed from './Feed.jsx';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import '../components/css/Home.scss';

function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
  const { darkMode } = useSelector((store) => store.darkMode);

  return (
    <motion.div 
      className={`home flex ${darkMode ? 'darkMode' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="flex-grow"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Feed />
        <Outlet />
      </motion.div>
      
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <RightSidebar />
      </motion.div>
    </motion.div>
  );
}

export default Home;

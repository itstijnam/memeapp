import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSidebar'


function MainLayout() {
  return (
    <div>
      <LeftSideBar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout
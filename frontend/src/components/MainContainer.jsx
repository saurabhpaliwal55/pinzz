import React from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { usePinzzState } from '../Context/ChatContext'

const MainContainer = () => {
  const { user } = usePinzzState();
  return user ? (
    <>
    <div className='flex flex-col bg-blue-300 h-screen'>
    <Navbar/>
    <Outlet/>
    </div>
    </>
  ) : (
    <Navigate to="/" replace />
  )
}

export default MainContainer

import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className='bg-white min-h-screen'>
      <Navbar />
      <main className='relative'>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

export default Layout

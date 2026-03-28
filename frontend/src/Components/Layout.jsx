import React  from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import Cart from './Cart'

const Layout = ({children}) => {
  return (
<div className='relative min-h-scree' id="hero-bg">
  <Cart />
  <NavBar/>
  <main>
    {children}
  </main>
  <Footer/>
</div>  )
}

export default Layout
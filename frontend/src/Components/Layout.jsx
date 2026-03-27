import React  from 'react'
import NavBar from './NavBar'
import Footer from './Footer'

const Layout = ({children}) => {
  return (
<div className='relative min-h-scree' id="hero-bg">
  <NavBar/>
  <main>
    {children}
  </main>
  <Footer/>
</div>  )
}

export default Layout
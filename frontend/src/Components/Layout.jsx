import React  from 'react'
import NavBar from './NavBar'

const Layout = ({children}) => {
  return (
<div className='relative min-h-scree' id="hero-bg">
  <NavBar/>
  <main>
    {children}
  </main>
</div>  )
}

export default Layout
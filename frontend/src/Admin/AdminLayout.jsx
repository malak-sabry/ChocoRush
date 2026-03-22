import { useState } from "react"
import { Menu, X, BookOpen, PlusCircle, Home, MenuIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
const AdminLayout = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className='min-h-screen bg-slate-50 text-slate-900'>
        <header className='stick flex items-center top-0 z-30 shadow-lg h-14'>

          <button className='md:hidden inline-flex items-center justify-center p-2'
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}>

            <Menu className="h-5 w-5" />
          </button>
          <h4 className='font-bold'>Admin Dashboard</h4>
        </header>
        {/* sidebar */}
        <div className='relative mx-auto flex'>
          <aside className={` relative h-screen flex flex-col
        transition-transform bg-slate-900  w-64
         text-slate-100 ${open ? "translate-x-0" :
              "-translate-x-full md:translate-x-0"}`}>



            <a
              className="md:hidden  
              absolute right-0   p-2 "
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </a>


            <nav className='flex-1 space-y-1 p-3 mt-15'>
              <NavLink to="/admin/products">
                <div className='flex items-center gap-3 mt-6'>

                  <BookOpen className="h-4 w-4" />
                  <span>See All Products</span>
                </div>

              </NavLink>


              <NavLink to="/admin/add-product">
                <div className='flex items-center gap-3 mt-6'>

                  <PlusCircle className="h-4 w-4" />
                  <span>Add Products</span>
                </div>

              </NavLink>
              <NavLink to="/admin/add-category">
                <div className='flex items-center gap-3 mt-6'>

                  <PlusCircle className="h-4 w-4" />
                  <span>Add Categories</span>
                </div>

              </NavLink>


              <NavLink to="/">
                <div className='flex items-center gap-3 mt-6'>

                  <Home className="h-4 w-4" />
                  <span>Return To Home Page</span>
                </div>

              </NavLink>



            </nav>

          </aside>
          <main className='w-full md:ml-64 '>
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

    </>)
}

export default AdminLayout
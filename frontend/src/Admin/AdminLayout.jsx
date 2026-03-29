import { useState } from "react"
import {
  LayoutGrid,
  Tags,
  PackagePlus,
  FolderPlus,
  ArrowLeftCircle,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

const AdminLayout = () => {
  const [open, setOpen] = useState(false)

  const navLink = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-[#4a3728] text-[#FCF0E6] shadow-md"
        : "text-[#8a6d5a] hover:bg-[#e8d5c4] hover:text-[#4a3728]"
    }`

  const navItems = [
    { to: "/admin/products",     icon: LayoutGrid,   label: "All Products"   },
    { to: "/admin/categories",   icon: Tags,         label: "All Categories" },
    { to: "/admin/orders",       icon: ShieldCheck, label: "Orders"         },
    { to: "/admin/add-product",  icon: PackagePlus,  label: "Add Product"    },
    { to: "/admin/add-category", icon: FolderPlus,   label: "Add Category"   },
  ]

  return (
    <div className="min-h-screen bg-[#f5e6d8] text-[#4a3728] flex flex-col">

      {/* ── Top Header ── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between
        px-5 bg-[#FCF0E6] border-b border-[#c9b49a] shadow-sm">

        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-[#e8d5c4] transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4a3728] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-[#FCF0E6]" />
            </div>
            <span className="font-bold text-[#4a3728] text-base tracking-tight">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Right: back to site */}
        <NavLink
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8a6d5a]
            hover:text-[#4a3728] transition-colors"
        >
          <ArrowLeftCircle className="h-4 w-4" />
          Back to Site
        </NavLink>
      </header>

      <div className="flex flex-1 pt-14">

        {/* ── Mobile overlay ── */}
        {open && (
          <div
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 flex flex-col
            bg-[#FCF0E6] border-r border-[#c9b49a]
            transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Close btn mobile */}
          <button
            className="md:hidden absolute top-3 right-3 p-1.5 rounded-lg
              hover:bg-[#e8d5c4] transition-colors"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5 text-[#4a3728]" />
          </button>

          {/* Section label */}
          <div className="px-5 pt-6 pb-3">
            <p className="text-[10px] font-bold text-[#b09070] uppercase tracking-widest">
              Management
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">

            {/* Browse group */}
            <p className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#c9b49a]">
              Browse
            </p>
            <NavLink to="/admin/products" className={navLink} onClick={() => setOpen(false)}>
              <LayoutGrid className="h-4 w-4 shrink-0" />
              <span>All Products</span>
            </NavLink>
            <NavLink to="/admin/categories" className={navLink} onClick={() => setOpen(false)}>
              <Tags className="h-4 w-4 shrink-0" />
              <span>All Categories</span>
            </NavLink>
            <NavLink to="/admin/orders" className={navLink} onClick={() => setOpen(false)}>
  <ShieldCheck className="h-4 w-4 shrink-0" />
  <span>Orders</span>
</NavLink>

            {/* Create group */}
            <p className="px-2 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#c9b49a]">
              Create
            </p>
            <NavLink to="/admin/add-product" className={navLink} onClick={() => setOpen(false)}>
              <PackagePlus className="h-4 w-4 shrink-0" />
              <span>Add Product</span>
            </NavLink>
            <NavLink to="/admin/add-category" className={navLink} onClick={() => setOpen(false)}>
              <FolderPlus className="h-4 w-4 shrink-0" />
              <span>Add Category</span>
            </NavLink>
          </nav>

          
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 md:ml-64 min-h-[calc(100vh-3.5rem)]">
          <div className="mx-auto max-w-6xl p-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminLayout
import { HashLink } from "react-router-hash-link";
const Footer = () => {
  const links = [
    { name: "home", path: "/" },
    { name: "shop", path: "/shop" },
    { name: "categories", path: "/#categories" },
  ];
  return (
    <>

      <footer className="bg-[#2d211e] text-[#f5e6d3] border-t border-[#5c3a21] shadow-lg">

        <div className="container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Logo + About */}
          <div className="space-y-5">
            <a className="text-4xl font-bold font-mono hover:scale-105 transition duration-300" href="/">

              <span>ChocoRush</span>
              <span className="text-sm ml-2 bg-[#a67c52]/30 px-2 py-1 rounded-full">
                BETA
              </span>
            </a>

            <p className="text-base text-[#e6d3b3] leading-relaxed">
              Delicious handcrafted chocolates made to create unforgettable moments.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold">Explore</h3>

            <ul className="space-y-4 text-base">
              {links.map((link) => (
                <li key={link.name}>
                  <HashLink
                    smooth
                    to={link.path}
                    className="hover:text-[#d2b48c] transition duration-200"
                  >
                    {link.name}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold">Stay Updated</h3>

            <p className="text-base text-[#e6d3b3]">
              Get updates on new flavors and offers.
            </p>

            <div className="flex">
              <input
                placeholder="your@email.com"
                className="grow px-4 py-3 rounded-l-lg bg-[#5c3a21] border border-[#a67c52]
          focus:outline-none focus:ring-2 focus:ring-[#d2b48c] text-white"
                type="email"
              />

              <button className="px-5 py-3 bg-[#a67c52] text-[#3e2723] font-semibold rounded-r-lg 
        hover:bg-[#d2b48c] transition duration-300">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#5c3a21] py-6">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

            <div className="text-sm text-[#e6d3b3] mb-4 md:mb-0">
              © 2026 ChocoRush. All rights reserved.
            </div>

            <div className="flex space-x-6 text-sm">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-[#d2b48c] transition"
                >
                  {item}
                </a>
              ))}
            </div>

          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
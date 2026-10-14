import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl font-semibold transition-all duration-150 
  text-sm flex items-center gap-1.5 ${
      isActive
        ? "bg-gold text-white shadow-sm"
        : "text-white hover:bg-french/25 hover:text-white active:scale-95"
    }`;
  return (
    <nav
    /**for the external structure of navbar */
      className="bg-navy border-b border-gold/40 sticky top-0 z-40 w-full shadow-xs"
      dir="ltr"
    >
      {/* fot the content of navbar*/}
      <div className="w-full px-4 sm:px-8 py-3.5 flex items-center 
      justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Einstein it logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-white">
            Einstein it
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/books" className={linkClass}>
            Books
          </NavLink>
          <NavLink to="/borrows" className={linkClass}>
            Borrows
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

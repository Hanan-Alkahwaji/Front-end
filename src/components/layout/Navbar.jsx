import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl font-semibold transition-all duration-150 
  text-sm flex items-center gap-1.5 ${
      isActive
        ? "bg-emerald-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
    }`;
  return (
    <nav
    /**for the external structure of navbar */
      className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full shadow-xs"
      dir="ltr"
    >
      {/* fot the content of navbar*/}
      <div className="w-full px-4 sm:px-8 py-3.5 flex items-center 
      justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">📚</span>
          <span className="text-xl font-bold text-gray-900">
            Library Management
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

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="ltr">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
       <Outlet/>
      </main>
    </div>
  );
};

export default AppLayout;

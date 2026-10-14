import { Routes, Route, Navigate } from "react-router-dom";
import BooksPage from "./pages/BookPage.jsx";
import BorrowsPage from "./pages/BorrowPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/borrows" element={<BorrowsPage />} />
      </Route>
    </Routes>
  );
};

//if i want to put the applayout around all the routes
//it's less easy to add new page route without the layout and
//in this case take an children not outlet

export default App;

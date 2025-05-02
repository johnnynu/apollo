import { Outlet } from "react-router";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

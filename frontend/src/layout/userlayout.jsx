import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { ToastContainer } from 'react-toastify';

export default function userLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const publicPaths = ["/login", "/register", "/forgetPassword", "/verifyotp", "/resetpass"];

    if (!token && !publicPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

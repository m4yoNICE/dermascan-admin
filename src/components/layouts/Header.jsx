import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    /* 1. Remove the border-b from this main container */
    <div className="relative"> 
      <div className="flex justify-end items-center px-8 py-3">
        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpen(!open)} className="focus:outline-none">
            <div className="p-[2px] rounded-full border border-gray-200 shadow-sm">
               <img
                src="logo.png"
                alt="Dermascan Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl border z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* 2. This is the custom border line */}
      {/* mx-8 creates the gap on the left and right to match your design */}
      <div className="mx-8 border-b border-[#00CC99]/40" />
    </div>
  );
};

export default Header;
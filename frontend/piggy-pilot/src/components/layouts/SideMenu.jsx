import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar"

const SideMenu = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName || ""}
            width="w-20"
            height="h-20"
            style="flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100 text-2xl"
          />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 ${
              isActive
                ? "text-white bg-purple-600"
                : "text-gray-700 hover:bg-purple-100"
            }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SideMenu;

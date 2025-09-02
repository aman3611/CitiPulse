import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  Home,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  Code,
  Bell
} from "lucide-react";
import axios from "axios";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, role, logout, id, email, name } = useAuth();
  const [formData, setFormData] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Issue Resolved",
      message: "Your reported issue #123 has been resolved by the authority.",
      isRead: false,
    },
    {
      id: 2,
      title: "New Comment",
      message: "Someone commented on your issue #122.",
      isRead: false,
    },
  ]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (!role || !token) return;
      try {
        const response = await axios.get(
          role === "user"
            ? `${
                import.meta.env.VITE_CITIPULSE_BACKEND_URL
              }/api/user/profile/${role}/${id}`
            : role === "government"
            ? `${
                import.meta.env.VITE_CITIPULSE_BACKEND_URL
              }/api/gov/profile/${role}/${id}`
            : null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };
    fetchUserData();
  }, [role, token]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const dashboardPath =
    role === "user"
      ? "/user/dashboard"
      : role === "government"
      ? "/government/dashboard"
      : "/admin/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = token
    ? [
        { name: "Home", path: "/", icon: <Home size={18} /> },
        { name: "Dashboard", path: dashboardPath, icon: <User size={18} /> },
      ]
    : [
        { name: "Home", path: "/", icon: <Home size={18} /> },
        { name: "Login", path: "/login", icon: <LogIn size={18} /> },
        { name: "Signup", path: "/signup", icon: <UserPlus size={18} /> },
      ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 tracking-tight"
        >
          CitiPulse
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center">
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                isActive(path)
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {name}
            </Link>
          ))}

          {token && (
            <>
              <div className="relative">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {notifications.some((n) => !n.isRead) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                      <div className="p-3 font-medium border-b text-gray-800">
                        Notifications
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">
                          No notifications yet.
                        </div>
                      ) : (
                        <ul className="max-h-60 overflow-y-auto">
                          {notifications.map((notif) => (
                            <li
                              key={notif.id}
                              className={`px-4 py-3 text-sm border-b border-gray-100 ${
                                notif.isRead
                                  ? "text-gray-500"
                                  : "text-gray-800 font-medium"
                              }`}
                            >
                              <div className="font-semibold">{notif.title}</div>
                              <div className="text-xs text-gray-600">
                                {notif.message}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, isRead: true }))
                          )
                        }
                        className="w-full py-2 text-sm text-center text-blue-600 hover:bg-gray-100"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {formData?.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-bold">
                      {name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-76 bg-white shadow-xl rounded-md border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 flex items-center gap-3 border-b border-gray-200">
                      {formData?.profilePhoto ? (
                        <img
                          src={formData.profilePhoto}
                          className="w-10 h-10 rounded-full border border-blue-500"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-semibold rounded-full">
                          {name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800">
                          {name || "User"}
                        </div>
                        <div className="text-xs text-gray-500">{email}</div>
                      </div>
                    </div>
                    {role !== "admin" && (
                      <Link
                        to={`/user/profile/${role}/${id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={16} /> Profile Settings
                      </Link>
                    )}
                    <Link
                      to={`/developers`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Code size={16} /> Developers
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-gray-700 hover:text-blue-600"
        >
          <MenuIcon size={26} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-700">CitiPulse</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-700 hover:text-red-500"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {token && (
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-200">
            {formData?.profilePhoto ? (
              <img
                src={formData.profilePhoto}
                className="w-10 h-10 rounded-full border border-blue-500"
                alt="avatar"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-bold">
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="text-gray-800 font-medium">{name || "User"}</div>
              <div className="text-xs text-gray-500">{email}</div>
            </div>
          </div>
        )}

        <nav className="flex flex-col px-3 py-4 gap-1">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
                isActive(path)
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {icon} {name}
            </Link>
          ))}

          {token && (
            <>
              <Link
                to={`/user/profile/${id}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100`}
              >
                <Settings size={18} /> Profile Settings
              </Link>
              <Link
                to={`/developers`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100`}
              >
                <Code size={18} /> Developers
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </header>
  );
};

export default Header;

import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation, useLogoutMutation } from '../../redux/api/userApiSlice';
import { logout } from '../../redux/features/auth/authSlice';
import './Navigation.css';

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => setDropdown(!dropdownOpen);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginApiCall] = useLoginMutation();
  const [logoutApiCall] = useLogoutMutation(); // ⛔️ Kept unchanged as you asked

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // Used for logout
      dispatch(logout());
      navigate('/login');
      closeSidebar();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showSidebar ? 'hidden' : 'flex'
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] transition-all duration-300 h-[100vh] fixed group`}
      id="navigation-container"
    >
      {/* Top Navigation Icons */}
      <div className="flex flex-col justify-center space-y-6 mt-10">
        <Link to="/" className="flex items-center transition-transform hover:translate-x-2">
          <AiOutlineHome size={24} />
          <span className="hidden group-hover:inline ml-2">Home</span>
        </Link>
        <Link to="/shop" className="flex items-center transition-transform hover:translate-x-2">
          <AiOutlineShopping size={24} />
          <span className="hidden group-hover:inline ml-2">Shop</span>
        </Link>
        <Link to="/cart" className="flex items-center transition-transform hover:translate-x-2">
          <AiOutlineShoppingCart size={24} />
          <span className="hidden group-hover:inline ml-2">Cart</span>
        </Link>
        <Link to="/favorite" className="flex items-center transition-transform hover:translate-x-2">
          <FaHeart size={24} />
          <span className="hidden group-hover:inline ml-2">Favorite</span>
        </Link>
      </div>

      {/* User Dropdown */}
      <div className="relative">
        {userInfo && (
          <button
            onClick={toggleDropdown}
            className="flex items-center text-white mt-6 focus:outline-none"
          >
            <span className="hidden group-hover:inline">{userInfo.username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-2 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          </button>
        )}

        {dropdownOpen && userInfo && (
  <ul
    className="absolute bottom-16 left-16 w-48 bg-white text-black rounded shadow-lg p-2 z-50"
  >
    {userInfo.isAdmin && (
      <>
        <li><Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link></li>
        <li><Link to="/admin/productList" className="block px-4 py-2 hover:bg-gray-100">Products</Link></li>
        <li><Link to="/admin/categoryList" className="block px-4 py-2 hover:bg-gray-100">Category</Link></li>
        <li><Link to="/admin/orderList" className="block px-4 py-2 hover:bg-gray-100">Orders</Link></li>
        <li><Link to="/admin/userList" className="block px-4 py-2 hover:bg-gray-100">Users</Link></li>
      </>
    )}
    <li>
      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
        Profile
      </Link>
    </li>
    <li>
      <button
        onClick={logoutHandler}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Logout
      </button>
    </li>
  </ul>
)}
      </div>
      {/* Auth Links */}
      {!userInfo && (
        <div className="flex flex-col space-y-6 mt-10">
          <Link to="/login" className="flex items-center transition-transform hover:translate-x-2">
            <AiOutlineLogin size={24} />
            <span className="hidden group-hover:inline ml-2">Login</span>
          </Link>
          <Link
            to="/register"
            className="flex items-center transition-transform hover:translate-x-2"
          >
            <AiOutlineUserAdd size={24} />
            <span className="hidden group-hover:inline ml-2">Register</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navigation;

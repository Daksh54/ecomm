import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { Link } from 'react-router-dom';
import { useProfileMutation } from '../../redux/api/userApiSlice.js';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(userInfo?.username || '');
    setEmail(userInfo?.email || '');
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profile Updated Successfully');
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f] px-4 py-12">
      <div className="bg-[#1c1c1e] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-pink-500 mb-8 text-center">Update Profile</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-5">
            <label htmlFor="username" className="block text-white mb-2 font-medium">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2c] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-white mb-2 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2c] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-white mb-2 font-medium">New Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2c] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-white mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2c] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 transition-colors text-white font-semibold w-full py-2 rounded-md"
            >
              Update
            </button>

            <Link
              to="/user-orders"
              className="text-center bg-pink-700 hover:bg-pink-800 transition-colors text-white font-semibold w-full py-2 rounded-md"
            >
              My Orders
            </Link>
          </div>
        </form>

        {loadingUpdateProfile && <Loader />}
      </div>
    </div>
  );
};

export default Profile;

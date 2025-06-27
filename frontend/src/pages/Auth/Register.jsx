import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useRegisterMutation } from '../../redux/api/userApiSlice';
import Loader from '../../components/Loader';

const Register = () => {
  const [username, setUsername]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Registration successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-[#111] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-white">Create an Account</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 p-2 w-full bg-[#1a1a1a] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 p-2 w-full bg-[#1a1a1a] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 p-2 w-full bg-[#1a1a1a] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mt-1 p-2 w-full bg-[#1a1a1a] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 transition-colors duration-200 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white text-sm">
            Already have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-pink-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/api/userApiSlice';
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success('Login successful!');
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-[#111] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Sign In</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full bg-[#1a1a1a] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full bg-[#1a1a1a] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 transition-colors duration-200 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          {isLoading && <Loader/>}
          {/* <p className="mt-4 text-sm">
            New here?{' '}
            <Link to="/register" className="text-pink-400 hover:underline">
              Create an account
            </Link>
          </p> */}
        </form>
        <div className='mt-2'>
            <p className='text-white'>
                New Customer ? {" "}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className='text-pink-500 hover:underline'>Register </Link>
                    Create an account
            </p>
        </div>
        <img src="https://res.cloudinary.com/dujktdhqm/image/upload/v1751092859/logo_evvoyl.png" alt="" className='mt-12'/>
      </div>
    </section>
  );
};

export default Login;

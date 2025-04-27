import React from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header className="flex bg-purple-100 justify-between items-center p-4 bg-white shadow">
      <h1 className="text-4xl font-bold text-purple-700 pl-10">DevNest AI.</h1>
      <nav className="flex gap-6 justify-center items-center text-[18px] font-semibold pr-10">
        <Link to="/" className="text-purple-700">Home</Link>
        <a href="#" className="text-purple-700">Docs</a>
        <a href="#" className="text-purple-700">Blog</a>
        <Link to='/login' className="px-4 py-2 border border-purple-600 rounded-full text-purple-600">Login</Link>
        <Link to='/signup' className="px-5 py-3 bg-purple-800 text-white rounded-full">Signup</Link>
      </nav>
    </header>
  );
};

export default Header;

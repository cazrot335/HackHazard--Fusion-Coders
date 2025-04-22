import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import signupImg from "../assets/signupImg.png";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail('');
    setFullname('');
    setCompanyName('');
    setPassword('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-166 rounded">
      <div className="bg-white shadow-lg flex rounded-md">
      <div className="p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full p-2 mb-4 border rounded-md" required />

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded-md" required />

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded-md" required />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg">Signup</button>
        </form>
        <p className="text-center mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div className="mt-10 mr-6">
        <img src={signupImg} alt="Signup" className="w-80 h-80 rounded-lg shadow-md" />
      </div>
      </div>
    </div>
  );
};

export default Signup;
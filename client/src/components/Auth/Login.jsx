import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginImg from "../../assets/loginImg.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-166">
      <div className="bg-white shadow-lg flex rounded-md">
        <div className="p-8 rounded-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded-lg"
              required
            />
            <button type="submit" className="w-full bg-purple-800 text-white p-2 rounded-lg">
              Login
            </button>
          </form>

          {/* GitHub Login */}
          <a
            href="http://localhost:5000/auth/github"
            className="w-full mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg flex justify-center items-center hover:bg-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.6 0-12 5.4-12 12 0 5.3..." />
            </svg>
            Continue with GitHub
          </a>

          <p className="text-center mt-5 text-gray-600">
            New here?{" "}
            <Link to="/signup" className="text-purple-800">
              Create an account
            </Link>
          </p>
        </div>
        <div className="mt-12 mr-6">
          <img src={loginImg} alt="Login" className="w-60 h-60 rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default Login;

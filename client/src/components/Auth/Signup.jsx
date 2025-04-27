import React, { useState } from "react";
import { Link } from "react-router-dom";
import signupImage from "../../assets/signupImg.png"

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setFullname("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-166 rounded">
      <div className="bg-white shadow-lg flex rounded-md">
        <div className="p-8 rounded-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">Signup</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
              required
            />
            <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded-lg">
              Signup
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
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
        <div className="mt-10 mr-6">
          <img src={signupImage} alt="Signup" className="w-80 h-80 rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default Signup;

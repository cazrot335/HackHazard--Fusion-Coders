import React from 'react'
import { FaLock, FaCheckCircle } from "react-icons/fa";

const CodeControl = () => {
  return (
    <section className="bg-purple-50 flex flex-col md:flex-row justify-between items-center rounded-xl shadow-sm gap-20 p-20">
  
    <div className="md:w-1/2 space-y-6 pl-20">
      <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
        <FaLock className="text-purple-700" />
        Your Code, Your Control
      </h2>
      <ul className="space-y-3 text-purple-900">
        <li className="flex items-center gap-2">
          <FaCheckCircle className="text-purple-700" />
          No data logging by default
        </li>
        <li className="flex items-center gap-2">
          <FaCheckCircle className="text-purple-700" />
          Encrypted collaboration sessions
        </li>
        <li className="flex items-center gap-2">
          <FaCheckCircle className="text-purple-700" />
          Self-hosting options (coming soon)
        </li>
        <li className="flex items-center gap-2">
          <FaCheckCircle className="text-purple-700" />
          Groq-powered for secure inference
        </li>
      </ul>
    </div>

    <div className="md:w-1/3 mt-10 md:mt-0">
      <div className="rounded-xl shadow-md overflow-hidden bg-white">
        <div className="bg-purple-200 p-8 flex justify-center">
          <FaLock className="text-purple-800 text-4xl" />
        </div>
        <div className="text-center py-6 px-4 text-purple-800 font-semibold">
          Your Code, <br /> Your Control
        </div>
      </div>
    </div>
  </section>
  )
}

export default CodeControl

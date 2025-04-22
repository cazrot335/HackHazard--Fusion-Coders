import React from "react";

const Users = () => {
  return (
    <section className="bg-purple-50 py-12 px-6 md:px-20 mb-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-60">
        {/* Left Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Students */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-purple-600 mb-4">
              <svg className="mx-auto w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0118 16.5c0 2.485-1.79 4.5-4 4.5s-4-2.015-4-4.5c0-1.224.445-2.342 1.173-3.184L12 14z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Students</h3>
            <p className="text-sm text-gray-600">Learn faster with code explanations & suggestions.</p>
          </div>

          {/* Freelancers */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-purple-600 mb-4">
              <svg className="mx-auto w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Freelancers</h3>
            <p className="text-sm text-gray-600">Speed up delivery with instant bug fixes and docstrings.</p>
          </div>

          {/* Teams */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-purple-600 mb-4">
              <svg className="mx-auto w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 9h10M7 13h10" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Teams</h3>
            <p className="text-sm text-gray-600">Collaborate in real-time, review code together.</p>
          </div>

          {/* Enterprises */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-purple-600 mb-4">
              <svg className="mx-auto w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21V3h18v18H3z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Enterprises</h3>
            <p className="text-sm text-gray-600">Boost productivity with Git integration and AI-powered insights.</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-4xl font-bold text-purple-900 mb-4">Who It’s For?</h2>
          <h3 className="text-lg font-semibold text-purple-800 mb-4">👥 Built for Every Developer</h3>
          <ul className="space-y-4 text-gray-700">
          <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-purple-800"><strong>Students:</strong> Learn faster with code explanations & suggestions.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-purple-800"><strong>Freelancers:</strong> Speed up delivery with instant bug fixes and docstrings.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-purple-800"><strong>Teams:</strong> Collaborate in real-time, review code together.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-1 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-purple-800"><strong>Enterprises:</strong> Boost productivity with Git integration and AI-powered insights.</span>
            </li>
            </ul>
        </div>
      </div>
    </section>
  );
};

export default Users;

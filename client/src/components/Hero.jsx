import React from 'react';
import AiCode from '../assets/AiCode.png';

const Hero = () => {
  return (
    <section className="bg-purple-100 p-10 flex flex-col md:flex-row items-center justify-between">
      <div className='p-10'>
        <h2 className="text-5xl md:text-5xl font-bold text-purple-800 mb-4">
          Real Time collaborative <br /> Editor with <span className="text-purple-600">AI Assistance</span>
        </h2>
        <p className="mb-6 text-purple-700">Code Smarter, Build Faster — Powered by AI.</p>
        <button className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold">
          Try It Now
        </button>
      </div>
      <img src={AiCode} alt="editor with bot" className="h-90 mt-10 md:mt-0" />
    </section>
  );
};

export default Hero;

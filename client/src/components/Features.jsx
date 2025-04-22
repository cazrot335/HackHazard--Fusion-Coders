import React from 'react';
import { FaMagic, FaBug, FaFileAlt, FaHandshake } from 'react-icons/fa';

const FeatureCard = ({ icon, title }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-purple-700 text-3xl mb-2">{icon}</div>
    <h4 className="text-md font-semibold text-purple-800">{title}</h4>
  </div>
);

const Features = () => {
  return (
    <section className="bg-white py-12">
      <h3 className="text-center text-4xl font-bold text-purple-800 mb-10">Features Of Our Application</h3>
      <div className="flex flex-wrap justify-center gap-40 px-4">
        <FeatureCard icon={<FaMagic />} title="AI Autocompletion" />
        <FeatureCard icon={<FaBug />} title="AI-Powered Linting & Bug Fixing" />
        <FeatureCard icon={<FaFileAlt />} title="Auto-Generated Docs" />
        <FeatureCard icon={<FaHandshake />} title="Real-Time Collaboration" />
      </div>
    </section>
  );
};

export default Features;

import {
    FaDiscord,
    FaLinkedin,
    FaGithub,
    FaDownload,
    FaPhone,
    FaEnvelope,
    FaBook,
    FaLock,
    FaFileAlt,
  } from "react-icons/fa";
import { SiX } from "react-icons/si"; 
import { PiSealCheckFill } from "react-icons/pi"; 
import { MdCall } from "react-icons/md";
import React from 'react'

const FooterSection = () => {
  return (
    <section className="bg-purple-50 text-purple-800 text-sm px-6 md:px-16 py-10 space-y-8">
  
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
     
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SiX className="text-xl" />
          <span>Twitter</span>
        </div>
        <div className="flex items-center gap-2">
          <FaDiscord className="text-xl" />
          <span>Discord</span>
        </div>
        <div className="flex items-center gap-2">
          <FaLinkedin className="text-xl" />
          <span>Linkedin</span>
        </div>
      </div>


      <div className="space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <MdCall className="text-xl" />
          <span>Contact Us</span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-xl" />
          <span>manisha13pdc@gmail.com</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-xl" />
          <span>7249516523</span>
        </div>
      </div>

     
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FaBook className="text-xl" />
          <span>Documentation</span>
        </div>
        <div className="flex items-center gap-2">
          <FaGithub className="text-xl" />
          <span>GitHub Repository</span>
        </div>
        <div className="flex items-center gap-2">
          <FaDownload className="text-xl" />
          <span>Download</span>
        </div>
        <div className="flex items-center gap-2">
          <PiSealCheckFill className="text-xl" />
          <span>AI Model: Code Llama</span>
        </div>
      </div>


      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FaFileAlt className="text-xl" />
          <span>Terms of Service</span>
        </div>
        <div className="flex items-center gap-2">
          <FaLock className="text-xl" />
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>

    
    <div className="border-t border-purple-200 pt-4 text-center text-xs text-purple-700">
      © 2025 DevNest AI. Built with <span className="text-purple-600">💜</span> by developers, for developers.
    </div>
  </section>
  )
}

export default FooterSection

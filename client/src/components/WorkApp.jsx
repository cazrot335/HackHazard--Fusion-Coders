import React from 'react'
import Editors from '../assets/Editors.png';

const WorkApp = () => {
    return (
        <section className="p-10 flex flex-col md:flex-row items-center justify-between gap-40">
            <img src={Editors} alt="editor with bot" className="h-90 mt-10 md:mt-0 p-10" />
            <div>
                <h2 className='text-4xl md:text-4xl font-bold text-purple-800 mb-4'>What our Application really do?</h2>
                <p className='text-xl text-purple-800'>DevNest AI is an AI-powered code editor that provides real-time code suggestions, bug fixes, and documentation using Code Llama on Groq. It boosts productivity with intelligent linting, autocompletion, live collaboration, and seamless Git integration — all in one smart workspace.</p>
                <button className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold mt-5">
                    Demo
                </button>
            </div>
        </section>
    )
}

export default WorkApp

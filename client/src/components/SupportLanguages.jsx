import React from 'react'
import LanguagesSup from '../assets/LanguagesSup.png';
const SupportLanguages = () => {
    return (
        <section className="p-10 flex flex-col md:flex-row items-center justify-between gap-40">
            <div className='p-10'>
                <h2 className='text-4xl md:text-4xl font-bold text-purple-800 mb-4'>Supported Languages</h2>
                <p className='text-xl text-purple-800'>DevNest AI is built to support a wide range of programming languages including Python, JavaScript, TypeScript, C++, Java, and HTML/CSS. Whether you're building web apps, scripting in Python, or working with compiled languages, DevNest AI delivers intelligent suggestions, linting, and documentation tailored to each language — all powered by AI.</p>
                <button className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold mt-5">
                    Try it Now
                </button>
            </div>
            <img src={LanguagesSup} alt="editor with bot" className="h-80 mt-10 md:mt-0 pr-10" />
        </section>
    )
}

export default SupportLanguages

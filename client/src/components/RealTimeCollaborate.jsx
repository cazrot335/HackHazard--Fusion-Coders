import React from 'react'
import codeEdit from '../assets/codeEdit.png';

const RealTimeCollaborate = () => {
    return (
        <section className="p-10 flex flex-col md:flex-row items-center justify-between gap-40">
            <img src={codeEdit} alt="editor with bot" className="h-90 mt-10 md:mt-0 p-10" />
            <div>
                <h2 className='text-4xl md:text-4xl font-bold text-purple-800 mb-4'>Real-Time AI-Powered Collaboration</h2>
                <p className='text-xl text-purple-800'>DevNest AI syncs your code and cursor across all contributors instantly. Watch edits unfold in real-time with inline AI suggestions, smart reviews, and debugging cues. It’s like coding with a super-powered team — even if you’re solo.</p>
                <button className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold mt-5">
                    Demo
                </button>
            </div>
        </section>
    )
}

export default RealTimeCollaborate

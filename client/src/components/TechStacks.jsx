import React from 'react'
import TechStack from '../assets/TechStacks.png';

const TechStacks = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-10 p-10'>
      <div>
        <h1 className='text-purple-800 font-bold text-4xl'>Powered By</h1>
      </div>
      <div>
        <img src={TechStack} alt="" />
      </div>
      <div><h1 className='text-purple-800 font-bold text-4xl'>Build smarter. Code faster. Powered by AI.</h1></div>
    </div>
  )
}

export default TechStacks

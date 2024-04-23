import React from 'react'
import { HashLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'><HashLoader color='#0067ff' /></div>
  )
}

export default Loader
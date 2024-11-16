import React from 'react'

const Scard = (props) => {
  return (
    <div className='h-72 w-3/12 min-w-28 bg-slate-700'>
      <div className='h-full flex flex-col justify-between py-3 px-4'>
        <div className='flex flex-row-reverse'>
            <h1 className='text-3xl text-wht font-medium'>props.date</h1>
            </div>
        <div className='flex flex-col'>
            <h1 className='font-semibold text-4xl text-wht'>props.event</h1>
            <h1 className='text-wht'>props.loc</h1>
        </div>
      </div>
    </div>
  )
}

export default Scard

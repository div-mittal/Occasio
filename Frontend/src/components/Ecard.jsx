import React from 'react'

const Ecard = (props) => {
return (
    <div className='h-full bg-[url("/image.png")] bg-cover bg-center min-w-[20%] bg-opacity-70 bg-white flex flex-col justify-between items-center rounded-md' >
        <div className='flex flex-col justify-between h-full w-full p-2'>
            <div className='flex flex-row-reverse'>
                <div className='flex flex-col items-center border-2 rounded-sm px-2 bg-blk bg-opacity-15'>
                    <h1 className='text-3xl font-medium text-wht'>20</h1>
                    <h1 className='text-white'>Dec</h1>
                </div>
            </div>
            <div className='flex'>
                <div className='flex flex-col px-2'>
                    <h1 className='text-3xl font-medium text-white'>Event Name</h1>
                    <h1 className='text-lg font-medium text-white'>Location</h1>
                </div>
            </div>
        </div>
    </div>
)
}

export default Ecard

import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Ecard from '../components/Ecard.jsx'
const Dashboard = () => {
    return (
        <div className='h-[100vh] bg-blk flex flex-col'>
            <Navbar/>
            <div className='dash w-full px-20 py-8 flex-grow'>
                <div className='relative flex flex-col w-full h-full p-6 border border-solid border-wht border-opacity-25 rounded-lg'>
                    <h1 className='text-wht text-2xl'>Dashboard</h1>
                    <div className='event-list flex flex-row flex-grow gap-4 py-4 overflow-auto minimal-scrollbar'>
                    <Ecard/>
                    <Ecard/>
                    <Ecard/>
                    <Ecard/><Ecard/>
                    <Ecard/><Ecard/>
                    <Ecard/><Ecard/>
                    <Ecard/><Ecard/>
                    <Ecard/>
                    </div>
                    <div className='flex justify-center items-center h-12 w-12 bg-ylw rounded-md absolute bottom-16 right-12'>
                        <h1 className='text-4xl font-bold text-blk'>+</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

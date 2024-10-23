import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { Button,ConfigProvider} from "antd";
const Signup = () => {
    const navigate = useNavigate(); 
return (
    <div className='bg-blk h-screen text-wht'>
        <ConfigProvider theme={{
        token: {
          colorPrimary: '#E0AF31',
          borderRadius: 2,
        },
      }}>
            <Navbar page='Login'/>
            <div className='flex justify-between mx-20 my-5'>
            <button onClick={() => navigate('/')} className='cursor-pointer text-[1.2rem]'>&lt; Back</button>
            <div className='flex gap-[6px] cursor-pointer hover:text-ylw hover:font-semibold'>
                <div>Organizer?</div>
                <div className='hover:text-wht hover:font-normal' >Click Here</div>
            </div>
            </div>
            <div className='flex h-[55vh] ml-20 mr-10 mt-5'>
                <div className='p-5 px-6 rounded border-wht border h-full w-[55%] flex flex-col'>
                    <div className='text-[1.4rem] flex justify-between w-full'>
                        <div>Sign Up</div>
                        <div className='opacity-25'>Attendee</div>
                    </div>
                    <div className='h-[75%] my-2'></div>
                    <div className='flex justify-end'>
                    {/* <button className=''>Register</button> */}
                    <Button onClick={() => navigate('/Signup')} type="primary" size='large' className='font-bold text-blk hover:!text-blk'>Register</Button>
                    </div>
                </div>
                <img className='w-[40%] h-[140%] mt-[-5%]' src="cal.png" alt="" />
            </div>
            </ConfigProvider>
    </div>
)
}

export default Signup
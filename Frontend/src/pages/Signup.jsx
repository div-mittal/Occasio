import React,{useState} from 'react'
import Navbar from '../components/Navbar'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button,ConfigProvider} from "antd";
// import 'react-phone-input-2/lib/style.css'
// import PhoneInput from 'react-phone-input-2';
const Signup = () => {
    const navigate = useNavigate(); 
    const location = useLocation();
    const [role, setRole] = useState(location.state?.role || 'Attendee');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicName, setProfilePicName] = useState("");

    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file)); // Create preview URL
            setProfilePicName(file.name); // Set file name
        }
    };
    // const [phoneNumber, setPhoneNumber] = useState('');
return (
    <div className='bg-blk h-screen text-wht'>
        <ConfigProvider theme={{
        token: {
          colorPrimary: '#E0AF31',
          borderRadius: 2,
        },
      }}>
            <Navbar page='Signup'/>
            <div className='flex justify-between mx-20 my-5'>
            <button onClick={() => navigate('/')} className='cursor-pointer text-[1.2rem]'>&lt; Back</button>
            <div className='flex gap-[6px] cursor-pointer hover:text-ylw hover:font-semibold'>
                <div>{role=="Attendee" ? "Organizer?" : "Attendee?"}</div>
                <div className='hover:text-wht hover:font-normal' onClick={()=>{
                    setRole(
                        role == "Attendee" ? "Organizer" : "Attendee"
                    )
                }} >Click Here</div>
            </div>
            </div>
            <div className='flex h-[55vh] mx-20  lg:mr-10 mt-5'>
                <div className='p-5 px-6 rounded border-wht border h-full lg:w-[55%] lg:flex flex-col w-[100%]'>
                    <div className='cursor-default text-[1.4rem] flex justify-between w-full'>
                        <div>Sign Up</div>
                        <div className='opacity-25'>{role == "Attendee" ? "Attendee" : "Organizer"}</div>
                    </div>
                    {
                        role==="Attendee" && 
                        <div className='h-[75%] mt-8 flex flex-col gap-[1rem]'>
                        <div className='flex'>
                        <input type="text" placeholder="Full Name" className='w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 ' />
                        {/* <input type="text" placeholder="Last Name" className='w-[50%] bg-transparent p-2 border border-wht border-opacity-25 rounded my-2' /> */}
                        </div>
                        <div className='flex gap-4'>
                        <input type="text" placeholder="Email" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 ' />
                        <input type="text" placeholder="Phone Number" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 ' />
                        </div>
                        <div className='flex gap-4'>
                        <input type="password" placeholder="Password" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' />
                        <input type="password" placeholder="Confirm Password" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' />

                        </div>      
                        
                        </div>
                    }
                    {
                        role==="Organizer" &&
                        <div className='h-[75%] mt-4 flex flex-col'>
                        <div className='flex'>
                        <input type="text" placeholder="Full Name" className='w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 ' />
                        {/* <input type="text" placeholder="Last Name" className='w-[50%] bg-transparent p-2 border border-wht border-opacity-25 rounded my-2' /> */}
                        </div>
                        <div className='flex gap-4'>
                        <input type="text" placeholder="Email" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 ' />
                        <input type="password" placeholder="Password" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' />

                        </div>
                        <div className='flex gap-4'>
                        {/* <input type="password" placeholder="Confirm Password" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' /> */}
                        <input type="text" placeholder="Phone Number" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2 ' />

                        <input type="text" placeholder="Address" className='w-[50%] bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' />

                        </div>

                        {/* <div className='flex'> */}
                        {/* <input type="text" placeholder="Phone Number" className='w-[50%] bg-transparent p-2 border border-wht border-opacity-25 rounded my-2 ' /> */}
                        {/* <input type="text" placeholder="Address" className='w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' /> */}
                        {/* </div> */}
                        {/* <div className='flex'>
                        <input type="file" onChange={handleProfilePicChange} placeholder="Address" className='w-full bg-transparent p-2 px-6 border border-wht border-opacity-25 rounded my-2' />
                        {profilePic && <img src={profilePic} alt="Profile Preview" className='w-20 h-20 rounded-full object-cover' />}

                        </div> */}
                        <div className='flex my-2 items-center gap-4 border border-wht border-opacity-25 rounded'>
                            {/* File upload input with "Choose File" label */}
                            <label className=' bg-transparent py-2.5 my-0 px-6 border-r border-wht border-opacity-25 cursor-pointer text-center'>
                                <span className="text-wht">Choose Profile Pic</span>
                                <input 
                                    type="file" 
                                    onChange={handleProfilePicChange} 
                                    className='hidden' 
                                    accept="image/*" // Accepts only image files
                                />
                            </label>
                            
                            {/* Display chosen file preview */}
                            {profilePic ? (
                                <div className="flex gap-4 justify-center items-center">
                                    <img 
                                        src={profilePic} 
                                        alt="Profile Preview" 
                                        className='w-10 h-10 rounded-full object-cover border border-wht border-opacity-25' 
                                    />
                                    <span className="text-wht opacity-75 text-md">{profilePicName}</span>
                                </div>

                            ) : (
                                <span className="text-wht opacity-75">No file chosen</span>
                            )}
                        </div>
                    </div>
                    }
                    {
                        role==="Attendee" && 
                        <div className='flex mt-[-1rem] justify-end'>
                        <Button onClick={() => navigate('/Dashboard')} type="primary" size='large' className='lg:m-0 font-bold text-blk hover:!text-blk'>Register</Button>
                        </div>
                    }
                    {
                        role==="Organizer" && 
                        <div className='flex justify-end'>
                        <Button onClick={() => navigate('/Dashboard')} type="primary" size='large' className='lg:m-0 font-bold text-blk hover:!text-blk'>Register</Button>
                        </div>
                    }
                    
                </div>
                <img className='w-[40%] h-[140%] mt-[-5%] xsm:hidden lg:flex' src="cal.png" alt="" />
            </div>
            </ConfigProvider>
    </div>
)
}

export default Signup
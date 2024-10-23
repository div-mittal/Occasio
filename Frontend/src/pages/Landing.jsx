import React from "react";
import Navbar from "../components/Navbar";
import { Button,ConfigProvider} from "antd";

function Landing() {
    return (
        <>
        <ConfigProvider theme={{
        token: {
          colorPrimary: '#E0AF31',
          borderRadius: 2,
        },
      }}>
        <div className="m-0 bg-blk h-screen text-wht">
            <Navbar/>
            <div className="mx-20 ml-12 my-16 mb-0  h-[55vh] flex items-center ">
                <div className="px-32 py-20 h-[100%] w-[50%] flex flex-col gap-[3rem] text-wht border-r border-wht border-{0.5px} border-opacity-50 height-100%">
                    <h1 className="text-xl">
                    Effortlessly organize, manage, and track attendance for conferences, workshops, and private gatherings. Create events, send invites, manage RSVPs, and track guest preferences—all in one place.
                    </h1>
                    <div className="flex flex-col gap-[1.5rem]">
                        <div className="text-[1.15rem]  font-semibold">Sign Up below to begin</div>
                        <div className="flex gap-[1.5rem]">
                            <Button type="primary" size='large' className='font-bold text-blk hover:!text-blk'>Attendee</Button>
                            <Button type="primary" size='large' className='font-bold text-blk hover:!text-blk'>Organizer</Button>
                            {/* <div className="text-[1.1rem] bg-ylw text-blk px-6 py-1.5 font-semibold rounded">Attendee</div> */}
                            {/* <div className="text-[1.1rem] bg-ylw text-blk px-6 py-1.5 font-semibold  rounded">Organizer</div> */}
                        </div>
                    </div>
                </div>
                <img src="landing.png" alt="" className="w-[38%] ml-28 px-4" />
            </div>
            <img src="landingFlower.png" className="absolute bottom-0 left-0 h-[9rem] "alt="" />
        </div>
        </ConfigProvider>
        </>
    );
}
export default Landing;


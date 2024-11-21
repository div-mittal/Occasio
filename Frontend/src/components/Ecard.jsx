import React from 'react'
import { useNavigate } from 'react-router-dom';
const Ecard = (props) => {
    const navigate=useNavigate();
    const date=new Date(props.date);
    const day=date.getDate();
    const month=date.toLocaleString('default', { month: 'short' });
    console.log(props.cover.url);

    const handleClick = () => {
        console.log(props.id);
        navigate(`/event/${props.id}`);
    }
return (
    <div className={`h-full bg-[url(${props.cover.url})] bg-cover bg-center min-w-[20%] bg-opacity-70 bg-white flex flex-col justify-between items-center rounded-md`} onClick={()=>handleClick()}>
        <div className='flex flex-col justify-between h-full w-full p-2'>
            <div className='flex flex-row-reverse'>
                <div className='flex flex-col items-center border-2 rounded-sm px-2 bg-blk bg-opacity-15'>
                    <h1 className='text-3xl font-medium text-wht'>{day}</h1>
                    <h1 className='text-white'>{month}</h1>
                </div>
            </div>
            <div className='flex'>
                <div className='flex flex-col px-2'>
                    <h1 className='text-3xl font-medium text-white'>{props.title}</h1>
                    <h1 className='text-lg font-medium text-white'>{props.location}</h1>
                </div>
            </div>
        </div>
    </div>
)
}

export default Ecard

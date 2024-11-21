import React from 'react'
import { useNavigate } from 'react-router';
const Scard = (props) => {
  const navigate=useNavigate();  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleClick=()=>{
    navigate(`/event/${props.event._id}`);
  }

  return (
    <div className="h-72 w-3/12 min-w-28 bg-cover bg-center" style={{ backgroundImage: `url(${props.event.coverImage.url})` }} onClick={()=>handleClick()}>
      <div className='h-full flex flex-col justify-between py-3 px-4'>
        <div className='flex flex-row-reverse'>
            <h1 className='text-3xl text-wht font-medium'>{formatDate(props.event.date)}</h1>
            </div>
        <div className='flex flex-col'>
            <h1 className='font-semibold text-4xl text-wht'>{props.event.title}</h1>
            <h1 className='text-wht'>{props.event.location}</h1>
        </div>
      </div>
    </div>
  )
}

export default Scard

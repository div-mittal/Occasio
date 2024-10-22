import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center items-center h-[100vh]'>
        <h1 className='text-xl font-bold'>Hello is the css working</h1>
      </div>
    </>
  )
}

export default App

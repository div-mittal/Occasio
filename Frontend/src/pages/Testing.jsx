import React from 'react'
import { Button,ConfigProvider} from "antd";

function Testing() {
  return (
    <ConfigProvider theme={{
        token: {
          colorPrimary: '#E0AF31',
          borderRadius: 2,
        },
      }}>
    <div className='h-screen bg-slate-900 flex justify-center items-center'>
      <Button type="primary" className='font-bold text-blk hover:!text-blk'>Hello</Button>
    </div>
    </ConfigProvider>
  )
}

export default Testing

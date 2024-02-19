import { useEffect, useState } from 'react'
import FeaturedImages from './components/FeaturedImages/FeaturedImages'
import DrawingCanvas from './components/DrawingCanvas/DrawingCanvas'

import './App.css'


import { getMessage } from './services/message';


function App () {
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMessage().then(message => setMessage(message))
  }, [])

  return (
    <div className='home-page'>
      <FeaturedImages/>
      <p className='message'>{message}</p>
      <DrawingCanvas />
    </div>
  )
}

export default App

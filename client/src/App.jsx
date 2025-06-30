import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav from './components/Nav';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav />
      <div className='bg-q-primary'>hello</div>
      <div className='bg-q-primary-hover'>hello</div>
    </>
  )
}

export default App

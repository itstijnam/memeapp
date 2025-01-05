import { useState } from 'react'
import Signup from './components/ui/Signup'
import './App.css'
import { Button } from './components/ui/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Signup/>
      <Button> hello </Button>
    </>
  )
}

export default App

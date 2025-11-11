import React from 'react'
import { Route,Routes } from 'react-router-dom'
import List from './pages/List'
import {ToastContainer} from 'react-toastify'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Navbar/>
      <Routes>
        <Route path='/' element={<List/>}/>
      </Routes>

    </>
  )
}

export default App

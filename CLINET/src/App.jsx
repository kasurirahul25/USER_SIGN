import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pagess/Homepage'
import Login from './pagess/Loginpage'
import Emailverify from './pagess/Mailverifypage'
import ResetPassword from './pagess/Passwordrestpage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<Emailverify/>}/>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
      </Routes>

    </div>
  )
}

export default App

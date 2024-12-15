import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pagess/Homepage'
import Login from './pagess/Loginpage'
import Emailverify from './pagess/Mailverifypage'
import ResetPassword from './pagess/Passwordrestpage'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div>
      <ToastContainer/>
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

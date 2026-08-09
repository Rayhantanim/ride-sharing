import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import Signup from '../Pages/Signup/Signup';
import PhoneSignup from '../Pages/Signup/PhoneSignup';
import Login from '../Pages/Login/Login';
import CreateAccount from '../Pages/Signup/CreateAccount';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup></Signup>,
  },
  {
    path: "/phone-signup",
    element:<PhoneSignup></PhoneSignup>
  },
  {
    path:"/login",
    element: <Login></Login>
  },
  {
    path:"/signup",
    element: <CreateAccount></CreateAccount>
  }
]);

export default router

import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Signup from "../Pages/Signup/Signup";
import PhoneSignup from "../Pages/Signup/PhoneSignup";
import Login from "../Pages/Login/Login";
import CreateAccount from "../Pages/Signup/CreateAccount";
import ForgetPass from "../Components/ForgetPass";
import Home from "../Pages/Home/Home";

import RideManagement from "../Pages/Ridemanagement/RideManagement";
import Support from "../Pages/Support/Support";
import VerifyOtp from "../Pages/VerifyOtp/VerifyOtp";

import Safety from "../Pages/Safety/Safety";
import SosEmergencyScreen from "../Pages/Safety/SosEmergency";
import EmergencyRideSwitch from "../Pages/Safety/EmergencyRideSwitch";
import SilentSosScreen from "../Pages/Safety/SilentSosScreen";
import TrustedCircle from "../Pages/Safety/TrustedCircle";
import DiscomfortReport from "../Pages/Safety/DiscomfortReport";
import FemaleDriverPreferences from "../Pages/Safety/FemaleDriverPreferences";
import AutomatedNightMood from "../Pages/Safety/AutomatedNightMood";
import AutoBlockUnsafeDriver from "../Pages/Safety/AutoBlockUnsafeDriver";
import SafetyChecklist from "../Pages/Safety/SafetyChecklist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },

  {
    path: "/home",
    element: <Home />,
  },

  {
    path: "/ride-management",
    element: <RideManagement />,
  },

  {
    path: "/support",
    element: <Support />,
  },

  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },

  {
    path: "/phone-signup",
    element: <PhoneSignup />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <CreateAccount />,
  },

  {
    path: "/forgetPass",
    element: <ForgetPass />,
  },

  {
    path: "/safety-preview",
    element: <Safety />,
  },

  {
    path: "/sos-emergency",
    element: <SosEmergencyScreen />,
  },

  {
    path: "/emergency-ride-switch",
    element: <EmergencyRideSwitch />,
  },

  {
    path: "/silent-sos",
    element: <SilentSosScreen />,
  },

  {
    path: "/trusted-circle",
    element: <TrustedCircle />,
  },

  {
    path: "/discomfort-report",
    element: <DiscomfortReport />,
  },

  {
    path: "/female-driver-preferences",
    element: <FemaleDriverPreferences />,
  },

  {
    path: "/automated-night-mode",
    element: <AutomatedNightMood />,
  },

  {
    path: "/auto-block-unsafe-driver",
    element: <AutoBlockUnsafeDriver />,
  },

  {
    path: "/safety-checklist",
    element: <SafetyChecklist />,
  },
]);

export default router;

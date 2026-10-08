import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LandingPage from './pages/Landingpage'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/Authpage'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import CreateBlog from './pages/CreateBlog'

function App() {

  return (
 <Routes>

    <Route path='/' element={<LandingPage/>}/>
     <Route path='/signup' element={<AuthPage/>}/>

      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }
      />

        <Route
        path='/create-blog'
        element={
          <ProtectedRoute>
            <CreateBlog/>
          </ProtectedRoute>
        }
      />

 </Routes>
  )
}

export default App

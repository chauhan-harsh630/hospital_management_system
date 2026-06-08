import { useState } from 'react'
import Login from './pages/login.jsx'

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="hero">
          <h1>Welcome to Hospital Management System</h1>
          <p>Manage your hospital efficiently and effectively with our comprehensive management system.</p>
          <button className="btn">{ <Login /> }</button>
        </div>
         </div>
    </div>
  )
}


export default App

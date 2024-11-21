import './navbar.css'
import Image from 'next/image'
import React from 'react'
import logo from '../app/assets/image/logo.png'

type Props = {}

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "black",
        padding: "10px 20px",
      }}
    > 
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Replace 'logo.png' with your logo file */}
        <Image
          src={logo}// Path to your logo
          alt="Logo"
          width={70} // Adjust width/height as needed
          height={70}
        />
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px" }}>

        <div style={{marginLeft:"30", marginRight:"20",}}>
        <a href="/">Home</a>
        </div>

        <a
          href="/bot"
        >
          Ask Ai
        </a>
        
        
      
      </div>
    </div>
  );
}
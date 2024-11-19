import Image from 'next/image'
import React from 'react'
import logo from '../app/assets/image/app_logo.png'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <div style={{backgroundColor: 'white', flexDirection: 'row', display: 'flex', alignItems: 'center', color: 'black'}}>

    <Image src={logo} width={70} alt="applogo" style={{color: 'white'}}>
      
    </Image>
      <p style={{
        marginRight:20,
      }}>API</p>
      <p style={{
        marginRight:20,
      }}>Blog</p>
      <p style={{
        marginRight:20,
      }}>About</p>
      <p style={{
        marginRight:20
      }}>Career</p>


  </div>
  )
}

export default Navbar
import './Header.css'
import React from 'react';


const Header = () => {
  return (
    <header className='header'>
      <button className='logo-button'>
      <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt='Logo' className='logo-icon'/>
      </button>
      <div className='search-bar'>
        <input type='text' placeholder='Search'/>
        <button className='search-button'>
          <img src={`${process.env.PUBLIC_URL}/icons/search.png`} alt='Search' className='search-icon'/>
        </button>
      </div>
      <div className='header-icon'>
        <button className='bell-button'>
          <img src={`${process.env.PUBLIC_URL}/icons/bell.png`} alt='Notifications' />
        </button>  
        <button className='setting-button'>  
          <img src={`${process.env.PUBLIC_URL}/icons/setting.png`} alt='Settings' />
        </button>  
      </div>
    </header>
  )
}
export default Header;
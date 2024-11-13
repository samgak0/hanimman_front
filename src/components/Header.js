import './Header.css'
import React from 'react';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as SettingIcon } from '../assets/icons/setting.svg';
import { ReactComponent as BellIcon } from '../assets/icons/bell24.svg';

const Header = () => {
  return (
    <header className='header'>
      <button className='logo-button'>
      <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt='Logo' className='logo-icon'/>
      </button>
      <div className='search-bar'>
        <input type='text' placeholder='Search'/>
        <button className='search-button'>
          <SearchIcon/>
        </button>
      </div>
      <div className='header-icon'>
        <button className='bell-button'>
          <BellIcon/>
        </button>  
        <button className='setting-button'>  
          <SettingIcon/>
        </button>  
      </div>
    </header>
  )
}
export default Header;
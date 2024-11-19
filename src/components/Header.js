import './Header.css';
import React from 'react';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as SettingIcon } from '../assets/icons/setting.svg';
import { ReactComponent as BellIcon } from '../assets/icons/bell24.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menuV.svg';
import { useNavigate } from 'react-router-dom';

const Header = ({ location, showMenu = false, showSearch = true, showLogo = false, showSetting = true, theme='dark' }) => {
  const navigate = useNavigate();

  const handleBellClick = () => {
    navigate('/notification');
  };

  const handleMenuClick = () => {
    console.log("메뉴 버튼 클릭");
  };

  return (
    <header className='header'>
      <div className="header-left">
        {location && <span className="header-left-location">{location}</span>}
        {showMenu && (
        <button className='menu-button' onClick={handleMenuClick}>
          <MenuIcon />
        </button>
      )}
      </div>
    
      {showLogo && (
          <button className='logo-button'>
            <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt='Logo' className='logo-icon' />
          </button>
        )}
      {showSearch && (
        <div className='search-bar'>
          <input className='search-bar-input' type='text' placeholder='Search' />
          <button className='search-button'>
            <SearchIcon />
          </button>
        </div>
      )}

      <div className='header-icon'>
          <button className='bell-button' onClick={handleBellClick}>
            <BellIcon />
          </button>
          {showSetting && (
          <button className='setting-button'>
            <SettingIcon />
          </button>
        )}
      </div>
    </header>
        );
      };

export default Header;

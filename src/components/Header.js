import './Header.css';
import React, { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
// import { ReactComponent as SettingIcon } from '../assets/icons/setting.svg';
import { ReactComponent as BellIcon } from '../assets/icons/bell24.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menuV.svg';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  location, 
  showMenu = false, 
  showSearch = true, 
  showLogo = false, 
  showLeft = true,
   }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false) // 메뉴 열림 상태

  const handleBellClick = () => {
    navigate('/notification');
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen) // 메뉴 열림/닫힘 상태 토글
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".menu-dropdown") && // 메뉴 내부가 아닌 경우
        !event.target.closest(".menu-button") // 메뉴 버튼이 아닌 경우
      ) {
        setMenuOpen(false); // 메뉴 닫기
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside); // 이벤트 제거
    };
  }, []);

  return (
    <header className='header'>
      {showLeft && (
      <div className="header-left">
        {location && <span className="header-left-location">{location}</span>}
        {showMenu && (
        <button className='menu-button' onClick={handleMenuClick}>
          <MenuIcon />
        </button>
      )}
      </div>
      )}
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
      </div>

      {/* 메뉴 드롭다운 */}
      {menuOpen && (
        <div className="menu-dropdown">
          <div className="menu-dropdown-item">양주동</div>
          <div className="menu-dropdown-item selected">우제 2동</div>
          <div className="menu-dropdown-footer">내 동네 설정</div>
        </div>
      )}
      
    </header>
        );
      };

export default Header;

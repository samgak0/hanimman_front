import './Header.css';
import React, { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as BellIcon } from '../assets/icons/bell24.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menuV.svg';
import { useNavigate } from 'react-router-dom';
import locationsData from '../data/location.json'; // JSON 파일 가져오기

const Header = ({
  showMenu = false,
  showSearch = true,
  showLogo = false,
  showLeft = true,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림 상태
  const [selectedLocation, setSelectedLocation] = useState(
    locationsData.lastUsedLocation // JSON에서 "마지막 사용 주소"를 초기값으로 설정
  );

  const handleBellClick = () => {
    navigate('/notification');
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen); // 메뉴 열림/닫힘 상태 토글
  };

  const handleLocationSettingsClick = () => {
    navigate('/locationsettings'); // '내 동네 설정' 클릭 시 이동
  };

  const handleLocationSelect = (newLocation) => {
    setSelectedLocation(newLocation); // 선택된 위치 업데이트
    setMenuOpen(false); // 메뉴 닫기

    // 선택된 위치를 "마지막 사용 주소"로 저장
    localStorage.setItem('lastUsedLocation', newLocation);
  };

  useEffect(() => {
    // 로컬스토리지에서 "마지막 사용 주소" 불러오기 (없으면 JSON 기본값 사용)
    const savedLocation = localStorage.getItem('lastUsedLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.menu-dropdown') && // 메뉴 내부가 아닌 경우
        !event.target.closest('.menu-button') // 메뉴 버튼이 아닌 경우
      ) {
        setMenuOpen(false); // 메뉴 닫기
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside); // 이벤트 제거
    };
  }, []);

  return (
    <header className="header">
      {showLeft && (
        <div className="header-left">
          <span className="header-left-location">{selectedLocation}</span>
          {showMenu && (
            <button className="menu-button" onClick={handleMenuClick}>
              <MenuIcon />
            </button>
          )}
        </div>
      )}
      {showLogo && (
        <button className="logo-button">
          <img
            src={`${process.env.PUBLIC_URL}/mangologo.png`}
            alt="Logo"
            className="logo-icon"
          />
        </button>
      )}
      {showSearch && (
        <div className="search-bar">
          <input
            className="search-bar-input"
            type="text"
            placeholder="Search"
          />
          <button className="search-button">
            <SearchIcon />
          </button>
        </div>
      )}

      <div className="header-icon">
        <button className="bell-button" onClick={handleBellClick}>
          <BellIcon />
        </button>
      </div>

      {/* 메뉴 드롭다운 */}
      {menuOpen && (
        <div className="menu-dropdown">
          {locationsData.locations.map((location, index) => (
            <div
              key={index}
              className={`menu-dropdown-item ${
                selectedLocation === location ? 'selected' : ''
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              {location}
            </div>
          ))}
          <div
            className="menu-dropdown-footer"
            onClick={handleLocationSettingsClick}
          >
            내 동네 설정
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
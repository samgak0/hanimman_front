import "./Header.css";
import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import { ReactComponent as BellIcon } from "../assets/icons/bell24.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menuV.svg"; // 아래 화살표 버튼
import { useNavigate } from "react-router-dom";
import locationsData from "../data/location.json"; // JSON 파일 가져오기
import { getAddress } from "../api/userApi"; // API 호출 함수 가져오기

const Header = ({
  showMenu = false,
  showSearch = true,
  showLogo = false,
  showLeft = true,
  showBell = true, // Bell 아이콘 표시 여부 (기본값 true로 설정)
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // 위치 메뉴 열림 상태
  const [hamburgerOpen, setHamburgerOpen] = useState(false); // 햄버거 메뉴 열림 상태
  const [selectedLocation, setSelectedLocation] = useState(
    locationsData.lastUsedLocation
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창 열림 상태
  const [address, setAddress] = useState(""); // 주소 상태 추가
  const [addressTwo, setAddressTwo] = useState(""); // 두 번째 주소 상태 추가

  const handleBellClick = () => {
    navigate("/notification");
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen); // 위치 메뉴 열림/닫힘 상태 토글
  };

  const handleHamburgerClick = () => {
    setHamburgerOpen(!hamburgerOpen); // 햄버거 메뉴 열림/닫힘 상태 토글
  };

  const handleLocationSettingsClick = () => {
    navigate("/locationsettings"); // '내 동네 설정' 클릭 시 이동
  };

  const handleNavigation = (path) => {
    navigate(path); // 전달된 경로로 이동
    setHamburgerOpen(false); // 햄버거 메뉴 닫기
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("lastUsedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addressData = await getAddress();
        console.log("Address data:", addressData);
        setAddress(addressData.primaryNeighborhoodName);
        setAddressTwo(addressData.secondNeighborhoodName);
        setSelectedLocation(addressData.primaryNeighborhoodName);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  return (
<header className="header">
  {/* 위치 버튼 (showLeft가 true일 때만) */}
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

  {/* 로고 버튼 (showLogo가 true일 때만) */}
  {showLogo && (
    <button className="logo-button">
      <img
        src={`${process.env.PUBLIC_URL}/mangologo.png`}
        alt="Logo"
        className="logo-icon"
      />
    </button>
  )}

  {/* 검색 바 */}
  {showSearch && (
    <div className={`search-bar-container ${isSearchOpen ? "open" : ""}`}>
      <button
        className="search-button"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <SearchIcon />
      </button>
      {isSearchOpen && (
        <form className="search-bar">
          <input
            className="search-bar-input"
            type="text"
            placeholder="Search"
          />
        </form>
      )}
    </div>
  )}

  {/* 알림 버튼 (showBell이 true일 때만) */}
  {showBell && (
    <button className="bell-button" onClick={handleBellClick}>
      <BellIcon />
    </button>
  )}

  {/* 햄버거 버튼 추가 */}
  <button className="hamburger-button" onClick={handleHamburgerClick}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="4" width="24" height="2" fill="white" />
      <rect y="11" width="24" height="2" fill="white" />
      <rect y="18" width="24" height="2" fill="white" />
    </svg>
  </button>

  {/* 위치 메뉴 드롭다운 */}
  {menuOpen && (
    <div className="menu-dropdown">
      <div
        className={`menu-dropdown-item ${
          selectedLocation === address ? "selected" : ""
        }`}
        onClick={() => setSelectedLocation(address)}
      >
        {address}
      </div>
      {addressTwo && (
        <div
          className={`menu-dropdown-item ${
            selectedLocation === addressTwo ? "selected" : ""
          }`}
          onClick={() => setSelectedLocation(addressTwo)}
        >
          {addressTwo}
        </div>
      )}
      <div
        className="menu-dropdown-footer"
        onClick={handleLocationSettingsClick}
      >
        내 동네 설정
      </div>
    </div>
  )}

  {/* 햄버거 메뉴 */}
  {hamburgerOpen && (
    <div className="hamburger-menu">
      <div
        className="hamburger-menu-item"
        onClick={() => handleNavigation("/togetherlist")}
      >
        같이가요
      </div>
      <div
        className="hamburger-menu-item"
        onClick={() => handleNavigation("/sharelist")}
      >
        나눠요
      </div>
    </div>
  )}
</header>
  );
};

export default Header;
import "./Header.css";
import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import { ReactComponent as BellIcon } from "../assets/icons/bell24.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menuV.svg"; // 아래 화살표 버튼
import { ReactComponent as BackIcon2 } from "../assets/icons/back2.svg";
import { useNavigate } from "react-router-dom";
import locationsData from "../data/location.json"; // JSON 파일 가져오기
import { getAddress } from "../api/userApi"; // API 호출 함수 가져오기

const Header = ({
  showMenu = false,
  showSearch = true,
  showBack = false,
  showLeft = true,
  showBell = true, // Bell 아이콘 표시 여부 (기본값 true로 설정)
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // 위치 메뉴 열림 상태
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

  const handleLocationSettingsClick = () => {
    navigate("/locationsettings"); // '내 동네 설정' 클릭 시 이동
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
{/* 뒤로 */}
  {showBack && (

<button style={{"transform":"scale(0.7)"}} className="together-back-button" onClick={() => navigate(-1)}>
<BackIcon2 />
</button>
  )}
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

{/* 검색 버튼 */}
{showSearch && (
  <div className={`search-bar-container ${isSearchOpen ? "open" : ""}`}>
    <button
      className="search-button"
      onClick={() => setIsSearchOpen(!isSearchOpen)}
    >
      <SearchIcon />
    </button>
    {isSearchOpen && (
      <form
        className="search-bar"
        onSubmit={(e) => e.preventDefault()}  // 기본 폼 제출 방지
      >
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

</header>
  );
};

export default Header;
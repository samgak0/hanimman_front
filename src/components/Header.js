import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import { ReactComponent as BellIcon } from "../assets/icons/bell24.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menuV.svg";
import { ReactComponent as BackIcon2 } from "../assets/icons/back2.svg";
import { useNavigate } from "react-router-dom";
import locationsData from "../data/location.json";
import { getAddress } from "../api/userApi";
import "./Header.css";

const Header = ({
  showMenu = false,
  showSearch = true,
  showBack = false,
  showLeft = true,
  showBell = true,
  onLocationSelect,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    name:
      localStorage.getItem("selectedLocationName") ||
      locationsData.lastUsedLocation,
    id: localStorage.getItem("selectedAddressId") || null,
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBellClick = () => {
    navigate("/notification");
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLocationSettingsClick = () => {
    navigate("/locationsettings");
  };

  const handleLocationSelect = (locationName, addressId) => {
    setSelectedLocation({ name: locationName, id: addressId });
    setMenuOpen(false);
    localStorage.setItem("selectedAddressId", addressId);
    localStorage.setItem("selectedLocationName", locationName);
    if (onLocationSelect) {
      onLocationSelect(addressId);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocationName");
    const savedAddressId = localStorage.getItem("selectedAddressId");
    if (savedLocation && savedAddressId) {
      setSelectedLocation({ name: savedLocation, id: savedAddressId });
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addressData = await getAddress();
        console.log("Address data:", addressData);
        setAddress(addressData);
        if (!localStorage.getItem("selectedAddressId")) {
          setSelectedLocation((prevLocation) => ({
            ...prevLocation,
            name: addressData.primaryNeighborhoodName,
            id: addressData.primaryAddressId,
          }));
          localStorage.setItem(
            "selectedAddressId",
            addressData.primaryAddressId
          );
          localStorage.setItem(
            "selectedLocationName",
            addressData.primaryNeighborhoodName
          );
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  return (
    <header className="header">
      {showBack && (
        <button
          style={{ transform: "scale(0.7)" }}
          className="together-back-button"
          onClick={() => navigate(-1)}
        >
          <BackIcon2 />
        </button>
      )}
      {showLeft && (
        <div className="header-left">
          <span className="header-left-location">{selectedLocation.name}</span>
          {showMenu && (
            <button className="menu-button" onClick={handleMenuClick}>
              <MenuIcon />
            </button>
          )}
        </div>
      )}
      {showSearch && (
        <div className={`search-bar-container ${isSearchOpen ? "open" : ""}`}>
          <button
            className="search-button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <SearchIcon />
          </button>
          {isSearchOpen && (
            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <input
                className="search-bar-input"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}
        </div>
      )}
      {showBell && (
        <button className="bell-button" onClick={handleBellClick}>
          <BellIcon />
        </button>
      )}
      {menuOpen && (
        <div className="menu-dropdown">
          <div
            className={`menu-dropdown-item ${
              selectedLocation.name === address.primaryNeighborhoodName
                ? "selected"
                : ""
            }`}
            onClick={() =>
              handleLocationSelect(
                address.primaryNeighborhoodName,
                address.primaryAddressId
              )
            }
          >
            {address.primaryNeighborhoodName}
          </div>
          {address.secondNeighborhoodName && (
            <div
              className={`menu-dropdown-item ${
                selectedLocation.name === address.secondNeighborhoodName
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleLocationSelect(
                  address.secondNeighborhoodName,
                  address.secondlyAddressId
                )
              }
            >
              {address.secondNeighborhoodName}
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

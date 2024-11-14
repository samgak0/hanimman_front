import { useState } from "react";
import "./LocationSelect.css"

const LocationSelect = () => {
  const [shopList, setShopList] = useState([]);
  const handleClick = async (area) => {
    const url = `http://127.0.0.1:8080/area?areaCode=${area}`;
    const data = await fetch(url);
    const res = await data.json();
    console.log(res);
    setShopList(res);
  }
  return (
    <div className="location-select-page">
    <header className="list-header">
      <button className="select-close-button" onClick={() => window.history.back()}>

      </button>
    </header>
    <div className="button-store">
        <button className="costco" onClick={() => {
          handleClick('1');
        }}>COSTCO</button>
        <button className="emart" onClick={() => {
          handleClick('2');
        }}>EMART TRADERS</button>
        <button className="etc" onClick={() => {
          handleClick('3');
        }}>ETC.</button>
    </div>

    <div className="location-options">
      <div className="font-location-back">
        <h3 className="font-loaction-title">지역</h3>
      </div>
      <div className="button-location">
        <button className="" onClick={() => {
          handleClick('1');
        }}>서울</button>
        <button onClick={() => {
          handleClick('2');
        }}>경기</button>
        <button onClick={() => {
          handleClick('3');
        }}>인천/세종/충남</button>
         <button onClick={() => {
          handleClick('4');
        }}>대전/대구</button>
         <button onClick={() => {
          handleClick('5');
        }}>부산/울산/경남</button>
        {/* 나머지 지역들 */}
      </div>
    </div>
    
    <div className="store-options">
      <div className="font-location-back">
        <h3 className="font-loaction-title">점포</h3>
      </div>
      <div className="store-list">
      {
        shopList.map((v) => {
          return (
            <button>{v}</button>
          )
        })
      }
      </div>
      {/* <button>양평점</button>
      <button>일산점</button> */}
      {/* 나머지 점포들 */}
    </div>
  </div>
  )
}
export default LocationSelect
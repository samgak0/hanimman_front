import { useNavigate } from 'react-router-dom';

import '../maincss/MainPage.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import data from '../../../data/togetherAndShareItems.json';
import Slider from '../../../components/Slider';
import { ReactComponent as ShareIcon } from '../../../assets/icons/share.svg';
import { ReactComponent as TogetherIcon } from '../../../assets/icons/together.svg';
import axios from 'axios';
import jwtAxios from '../../../api/jwtAxios';

const MainPage = () => {
  const {togetherItems, shareItems} = data;
  const navigate = useNavigate();

  const handleTogetherClick = () => {
    navigate("/togetherlist"); 
  }
  const handleShareClick = () => {
    navigate("/sharelist");
  }

  const resultData = jwtAxios("http://localhost:8080/main", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
  
    });

    console.log(resultData);

  return (
    <div className='mobile-container'>
    <div className='main-page'>
        <Header showLogo={true} showMenu={false} showSearch={true} showLeft={false}  />
      <div className='main-content'>
        <section className='category'>
          <div className='together-selector'>
            <button className='together-button' onClick={handleTogetherClick}>
              <TogetherIcon/>
            </button>  
            <p className='together-font'>같이가요</p>
          </div>
          <div className='share-selector'>
            <button className='share-button' onClick={handleShareClick}>
              <ShareIcon/>
            </button>
            <p className='share-font'>나눠요</p>
          </div>  
        </section>
        <section className='together-slider'>
          <h3 className='neighborhood-font'>우리 동네 같이가요</h3>
          <Slider items={togetherItems} className='together-slider-card'/>
        </section>
        <section className='share-slider'>
          <h3 className='neighborhood-font'>우리 동네 나눠요</h3>
          <Slider items={shareItems} className='share-slider-card'/>
        </section>
      </div>
      <Footer />
    </div> 
    </div>
  )
}
export default MainPage;
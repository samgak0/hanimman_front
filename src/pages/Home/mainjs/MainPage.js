import '../maincss/MainPage.css'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import data from '../../../data/togetherAndShareItems.json'
import Slider from '../../../components/Slider';
import { ReactComponent as ShareIcon } from '../../../assets/icons/share.svg';
import { ReactComponent as TogetherIcon } from '../../../assets/icons/together.svg';

const MainPage = () => {
  const {togetherItems, shareItems} = data;

  return (
    <div className='main-page'>
      <Header />
      <div className='content'>
        <section className='category'>
          <div className='together-selector'>
            <button className='together-button'>
              <TogetherIcon/>
            </button>
            <p className='together-font'>같이가요</p>
          </div>
          <di className='share-selector'>
            <button className='share-button'>
              <ShareIcon/>
            </button>
            <p className='share-font'>나눠요</p>
          </di>  
        </section>

        <section className='together-slider'>
          <h3 className='neighborhood-together'>우리 동네 같이가요</h3>
          <Slider items={togetherItems}/>
        </section>
        <section className='share-slider'>
          <h3 className='neighborhood-share'>우리 동네 나눠요</h3>
          <Slider items={shareItems}/>
        </section>
      </div>
      <Footer />
    </div> 
  )
}
export default MainPage;
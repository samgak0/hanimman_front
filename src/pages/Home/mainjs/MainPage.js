import '../maincss/MainPage.css'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer';
import data from '../../../data/togetherAndShareItems.json'
import Slider from '../../../components/Slider';

const MainPage = () => {
  const {togetherItems, shareItems} = data;

  return (
    <div className='main-page'>
      <Header />
      <div className='content'>
        <section className='category'>
          <div className='together-selector'>
            <button className='together-button'>
              <img src={`${process.env.PUBLIC_URL}/icons/together.png`} className='together-img'  alt="같이가요"/>
            </button>
            <p className='together-font'>같이가요</p>
          </div>
          <di className='share-selector'>
            <button className='share-button'>
              <img src={`${process.env.PUBLIC_URL}/icons/share.png`} className='share-img' alt="나눠요"/>
            </button>
            <p className='share-font'>나눠요</p>
          </di>  
        </section>

        <section className='together-slider'>
          <h2>우리 동네 같이가요</h2>
          <Slider items={togetherItems}/>
        </section>
        <section className='share-slider'>
          <h2>우리 동네 나눠요</h2>
          <Slider items={shareItems}/>
        </section>
      </div>
      <Footer />
    </div> 
  )
}
export default MainPage;
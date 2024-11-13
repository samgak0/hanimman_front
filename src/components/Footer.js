import "./Footer.css"
import { ReactComponent as HomeIcon} from '../assets/icons/home.svg' 
import { ReactComponent as FavoriteIcon} from '../assets/icons/heart.svg' 
import { ReactComponent as ChatIcon} from '../assets/icons/chat.svg' 
import { ReactComponent as MypageIcon} from '../assets/icons/mypage.svg' 

const Footer = () => {
  return (
    <footer className="footer">
      <button className="footer-button">
        <div className="icon-wrapper">
          <HomeIcon/>
        </div>
        <div className="icon-wrapper">
          <FavoriteIcon/>
        </div>
        <div className="icon-wrapper">
          <ChatIcon/>
        </div>
        <div className="icon-wrapper">
          <MypageIcon/>
        </div>
      </button>
    </footer>
  )
}
export default Footer;
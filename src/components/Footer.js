import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <button className="footer-button">
        <div className="icon-wrapper">
          <img src={`${process.env.PUBLIC_URL}/icons/home.png`} alt="Home" />
        </div>
        <div className="icon-wrapper">
          <img src={`${process.env.PUBLIC_URL}/icons/favorite.png`} alt="Favorite" />
        </div>
        <div className="icon-wrapper">
          <img src={`${process.env.PUBLIC_URL}/icons/chat.png`} alt="Chat" />
        </div>
        <div className="icon-wrapper">
          <img src={`${process.env.PUBLIC_URL}/icons/mypage.png`} alt="Mypage" />
        </div>
      </button>
    </footer>
  )
}
export default Footer;
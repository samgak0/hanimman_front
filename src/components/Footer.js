import "./Footer.css";
import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import { ReactComponent as FavoriteIcon } from "../assets/icons/heart.svg";
import { ReactComponent as ChatIcon } from "../assets/icons/chat.svg";
import { ReactComponent as MypageIcon } from "../assets/icons/mypage.svg";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const MyPageClick = () => {
    navigate("/mypage");
  };

  const HomeClick = () => {
    navigate("/main");
  };

  const ZzimClick = () => {
    navigate("/zzimlist");
  };

  const chatClick = () => {
    navigate("/chats");
  };

  return (
    <footer className="footer">
      <button className="footer-button">
        <div className="icon-wrapper" onClick={HomeClick}>
          <HomeIcon />
        </div>
        <div className="icon-wrapper" onClick={ZzimClick}>
          <FavoriteIcon />
        </div>
        <div className="icon-wrapper" onClick={chatClick}>
          <ChatIcon />
        </div>
        <div className="icon-wrapper" onClick={MyPageClick}>
          <MypageIcon />
        </div>
      </button>
    </footer>
  );
};
export default Footer;

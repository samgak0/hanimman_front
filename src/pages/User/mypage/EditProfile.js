import React, { useState } from 'react';
import './EditProfile.css'; // CSS 파일 경로
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('어느새');
  const [profileImage, setProfileImage] = useState('/images/default-avatar.png');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // 닉네임과 프로필 사진 저장 로직 추가
    alert('프로필이 수정되었습니다.');
    navigate('/myprofile');
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button>
        <h1>프로필 수정</h1>
      </header>

      <div className="edit-profile-content">
        <img className="edit-avatar" src={profileImage} alt="프로필 사진" />
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <button className="save-button" onClick={handleSave}>저장</button>
      </div>
    </div>
  );
};

export default EditProfile;
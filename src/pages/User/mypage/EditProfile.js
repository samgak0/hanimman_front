import React, { useEffect, useState } from "react";
import "./EditProfile.css"; // CSS 파일 경로
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../api/jwtAxios";

const EditProfile = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(
    "/images/default-avatar.png"
  ); // 기본 이미지

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await jwtAxios.get(
          "http://localhost:8080/users/editprofile",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        setNickname(response.data.nickname || "");
        const imageUrl = response.data.profileImage
          ? `http://localhost:8080/images/${response.data.profileImage}` // 이미지 경로 생성
          : "/images/noprofileimage.png"; // 기본 이미지

        setProfileImage(imageUrl || "/images/default-avatar.png"); // URL이 없을 경우 기본 이미지
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Base64로 변환된 이미지
      };
      reader.readAsDataURL(file); // 파일 데이터를 Base64로 읽기
    }
  };

  // 프로필 저장
  const handleSave = () => {
    const updateProfile = async () => {
      try {
        const formData = new FormData();
        formData.append("nickname", nickname);

        // 파일이 업로드된 경우만 추가
        const fileInput = document.querySelector("input[type='file']");
        if (fileInput.files[0]) {
          formData.append("profileImage", fileInput.files[0]);
        }

        const response = await jwtAxios.post(
          "http://localhost:8080/users/editprofile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Profile updated successfully:", response.data);
        navigate("/myprofile"); // 성공 후 이동
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };
    updateProfile();
  };

  return (
    <div className="mobile-container">
      <div className="edit-profile-container">
        <header className="edit-profile-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ◀
          </button>
          <h1>프로필 수정</h1>
        </header>

        <div className="edit-profile-content">
          {/* 프로필 이미지 미리보기 */}
          <img className="edit-avatar" src={profileImage} alt="프로필 사진" />

          {/* 이미지 업로드 입력 */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button className="save-button">기본 이미지 사용</button>

          {/* 닉네임 입력 */}
          <label>닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          {/* 저장 버튼 */}
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

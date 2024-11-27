import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // 전체 게시글 상태
  const [togetherCreateState, setTogetherCreateState] = useState({}); // 같이가요 생성 상태
  const [shareCreateState, setShareCreateState] = useState({}); // 나눠요 생성 상태
  const [shareSelectedLocation, setShareSelectedLocation] = useState(null); // 나눠요 위치정보
  const [selectedLocation, setSelectedLocation] = useState(null); // 같이가요 위치 정보
  const [shareAppliedPosts, setShareAppliedPosts] = useState([]); // 나눠요 신청된 게시글 상태
  const [appliedPosts, setAppliedPosts] = useState([]); // 같이가요 신청된 게시글 상태

  // 나눠요 신청 처리 함수
  const applyForSharePost = (postId) => {
    setShareAppliedPosts((prev) => {
      if (!prev.includes(postId)) {
        return [...prev, postId]; // 중복 방지 후 신청 추가
      }
      return prev; // 이미 신청된 경우 그대로 반환
    });
  };

  // 같이가요 신청 처리 함수
  const applyForTogetherPost = (postId) => {
    setAppliedPosts((prev) => {
      if (!prev.includes(postId)) {
        return [...prev, postId]; // 중복 방지 후 신청 추가
      }
      return prev; // 이미 신청된 경우 그대로 반환
    });
  };

  return (
    <DataContext.Provider
      value={{
        posts,
        setPosts,
        togetherCreateState,
        setTogetherCreateState,
        shareCreateState,
        setShareCreateState,
        shareSelectedLocation,
        setShareSelectedLocation,
        selectedLocation,
        setSelectedLocation,
        shareAppliedPosts,
        setShareAppliedPosts,
        applyForSharePost,
        appliedPosts,
        applyForTogetherPost,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

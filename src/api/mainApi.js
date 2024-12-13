// 메인페이지 api?


export const fetchTogetherAndShareItems = async () => {
  try {
    const togetherResponse = await fetch("/api/together"); // 함께가요 API 호출
    const shareResponse = await fetch("/api/share"); // 나눠요 API 호출

    const togetherData = await togetherResponse.json();
    const shareData = await shareResponse.json();

    // 두 데이터를 하나의 배열로 합침
    return [...togetherData.content, ...shareData.content]; 
  } catch (error) {
    console.error("Error fetching combined items: ", error);
    throw error;
  }
};
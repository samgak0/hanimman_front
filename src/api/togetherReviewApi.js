import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/together-review`;

export const createReview = async (togetherReviewDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/create`, togetherReviewDTO);
    return response.data;
  } catch (error) {
    console.error("후기 생성 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const readReview = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("후기 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const updateReview = async (id, togetherReviewDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, togetherReviewDTO);
    return response.data;
  } catch (error) {
    console.error("후기 업데이트 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("후기 삭제 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const getWrittenReviews = async (userId, pageable) => {
  try {
    const response = await jwtAxios.get(`${host}/written/${userId}`, {
      params: pageable,
    });
    return response.data;
  } catch (error) {
    console.error("작성한 후기 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const getAcceptReviews = async (targetId, pageable) => {
  try {
    const response = await jwtAxios.get(`${host}/accept/${targetId}`, {
      params: pageable,
    });
    return response.data;
  } catch (error) {
    console.error("받은 후기 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

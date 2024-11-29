import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/share-favorite`;

export const createShareFavorite = async (shareDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/create`, shareDTO);
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 좋아요 생성에 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteShareFavorite = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 좋아요 삭제에서 에러가 발생하였습니다.");
    throw error;
  }
};

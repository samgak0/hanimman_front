import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/together-favorite`;

export const createTogetherFavorite = async (parentId) => {
  try {
    console.log("parentId", parentId);
    const response = await jwtAxios.post(`${host}/create`, parentId);
    return response.data;
  } catch (error) {
    console.error("같이가요 게시글 좋아요 생성에 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteTogetherFavorite = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("같이가요 게시글 좋아요 삭제에서 에러가 발생하였습니다.");
    throw error;
  }
};

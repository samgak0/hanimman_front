import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/together-favorite`;

export const createTogetherFavorite = async (togetherDTO) => {
  try {
    console.log("parentId", togetherDTO);
    const response = await jwtAxios.post(`${host}/create`, togetherDTO, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("같이가요 게시글 좋아요 생성에 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteTogetherFavorite = async (togetherDTO) => {
  try {
    const response = await jwtAxios.delete(`${host}/${togetherDTO.id}`);
    return response.data;
  } catch (error) {
    console.error("같이가요 게시글 좋아요 삭제에서 에러가 발생하였습니다.");
    throw error;
  }
};

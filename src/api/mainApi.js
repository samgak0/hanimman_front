import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/shares-togethers`;

export const readMain = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}`);
    return response.data;
  } catch (error) {
    console.error("메인 게시글 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};
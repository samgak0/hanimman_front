import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/share-report`;

export const reportShare = async (shareReportDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/report`, shareReportDTO);
    return response.data;
  } catch (error) {
    console.error("나눠요 신고에 에러가 발생했습니다.");
    throw error;
  }
};

export const reportCategory = async () => {
  try {
    const response = await jwtAxios.get(`${host}/categories`);
    return response.data;
  } catch (error) {
    console.error("나눠요 신고 카테고리 조회에 에러가 발생했습니다.");
    throw error;
  }
};

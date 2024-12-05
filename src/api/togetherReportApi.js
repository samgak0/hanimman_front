import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/together-report`;

export const reportTogether = async (togetherReportDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/report`, togetherReportDTO);
    return response.data;
  } catch (error) {
    console.error("같이가요 신고에 에러가 발생했습니다.");
    throw error;
  }
};

export const reportCategory = async () => {
  try {
    const response = await jwtAxios.get(`${host}/categories`);
    return response.data;
  } catch (error) {
    console.error("같이가요 신고 카테고리 조회에 에러가 발생했습니다.");
    throw error;
  }
};

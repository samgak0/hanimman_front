import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/inquiry`;

export const createInquiry = async (formData) => {
  console.log("확인" + formData.inquiryDTO);
  try {
    const response = await jwtAxios.post(`${host}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("1:1 문의 생성 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const readInquiry = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("1:1 문의 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const updateInquiry = async (id, inquiryDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, inquiryDTO);
    return response.data;
  } catch (error) {
    console.error("1:1 문의 업데이트 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteInquiry = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("1:1 문의 삭제 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const listAllInquiries = async (pageable) => {
  try {
    const response = await jwtAxios.get(host, {
      params: pageable,
    });
    return response.data;
  } catch (error) {
    console.error("1:1 문의 목록 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const searchInquiries = async (id, pageable) => {
  try {
    const response = await jwtAxios.get(`${host}/search`, {
      params: { id, ...pageable },
    });
    return response.data;
  } catch (error) {
    console.error("1:1 문의 검색 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const downloadInquiryFile = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/download`, {
      params: { id },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      response.headers["content-disposition"].split("filename=")[1]
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("파일 다운로드 중 에러가 발생했습니다:", error);
    throw error;
  }
};

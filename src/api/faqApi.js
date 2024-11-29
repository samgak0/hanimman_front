import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/faq`;

export const createFaq = async (faqDTO, files) => {
  try {
    const formData = new FormData();
    formData.append(
      "faqDTO",
      new Blob([JSON.stringify(faqDTO)], { type: "application/json" })
    );
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
    const response = await jwtAxios.post(`${host}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("자주 묻는 질문 생성 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const readFaq = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("자주 묻는 질문 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const updateFaq = async (id, faqDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, faqDTO);
    return response.data;
  } catch (error) {
    console.error("자주 묻는 질문 업데이트 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("자주 묻는 질문 삭제 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const listAllFaqs = async (pageable) => {
  try {
    const response = await jwtAxios.get(host, {
      params: pageable,
    });
    return response.data;
  } catch (error) {
    console.error("자주 묻는 질문 목록 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const searchFaqs = async (keyword, pageable) => {
  try {
    const response = await jwtAxios.get(`${host}/search`, {
      params: { keyword, ...pageable },
    });
    return response.data;
  } catch (error) {
    console.error("자주 묻는 질문 검색 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const downloadFaqFile = async (id) => {
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

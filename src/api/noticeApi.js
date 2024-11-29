import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/notice`;

export const createNotice = async (noticeDTO, files) => {
  try {
    const formData = new FormData();
    formData.append(
      "noticeDTO",
      new Blob([JSON.stringify(noticeDTO)], { type: "application/json" })
    );
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
    const response = await jwtAxios.post(host, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("공지사항 생성 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const readNotice = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("공지사항 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const updateNotice = async (id, noticeDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, noticeDTO);
    return response.data;
  } catch (error) {
    console.error("공지사항 업데이트 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteNotice = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("공지사항 삭제 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const listAllNotices = async (pageable) => {
  try {
    const response = await jwtAxios.get(`${host}/list`, {
      params: pageable,
    });
    return response.data;
  } catch (error) {
    console.error("공지사항 목록 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const searchNotices = async (keyword, pageable) => {
  try {
    const response = await jwtAxios.get(`${host}/search`, {
      params: { keyword, ...pageable },
    });
    return response.data;
  } catch (error) {
    console.error("공지사항 검색 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const downloadNoticeFile = async (id) => {
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

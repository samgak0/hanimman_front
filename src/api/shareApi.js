import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/share`;

export const createShare = async (formData) => {
  try {
    const response = await jwtAxios.post(`${host}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 생성에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const readShare = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const updateShare = async (id, formData) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 수정에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const deleteShare = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 삭제에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const listAllShares = async (params) => {
  try {
    const response = await jwtAxios.get(`${host}/list`, { params });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 목록 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const searchShares = async (params) => {
  try {
    const response = await jwtAxios.get(`${host}/search`, { params });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 검색에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const listFavoriteShares = async (params) => {
  try {
    const response = await jwtAxios.get(`${host}/favorite/list`, { params });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 좋아요 리스트에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const listMyShares = async (params) => {
  try {
    const response = await jwtAxios.get(`${host}/list/user`, { params });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 내가 쓴 글 리스트에서 에러가 발생하였습니다.");
    throw error;
  }
};

import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/v1/share-participant`;

export const createParticipant = async (shareParticipantDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/create`, shareParticipantDTO);
    return response.data;
  } catch (error) {
    console.error("참여자 생성 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const readParticipant = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("참여자 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const updateParticipant = async (id, shareParticipantDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, shareParticipantDTO);
    return response.data;
  } catch (error) {
    console.error("참여자 업데이트 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const rejectParticipant = async (id) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}/rejected`);
    return response.data;
  } catch (error) {
    console.error("참여자 거절 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const acceptParticipant = async (id) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}/accepted`);
    return response.data;
  } catch (error) {
    console.error("참여자 수락 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const completeParticipant = async (id) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error("참여자 완료 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const deleteParticipant = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("참여자 삭제 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const listAllByParentId = async (parentId) => {
  try {
    const response = await jwtAxios.get(`${host}/list/${parentId}`);
    return response.data;
  } catch (error) {
    console.error("참여자 목록 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const listAllByParentIdAndRejectedIsFalse = async (parentId) => {
  try {
    const response = await jwtAxios.get(
      `${host}/list/${parentId}/rejected-false`
    );
    return response.data;
  } catch (error) {
    console.error("참여자 목록 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

export const listAllByUserId = async () => {
  try {
    const response = await jwtAxios.get(`${host}/list/user`);
    return response.data;
  } catch (error) {
    console.error("참여자 목록 조회 중 에러가 발생했습니다:", error);
    throw error;
  }
};

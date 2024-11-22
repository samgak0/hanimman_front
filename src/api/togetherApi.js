import axios from "axios";
import axiosInstance, { axiosInsnstance } from "./axiosInstance";
import jwtAxios from "./jwtAxios";

const host = `${axiosInstance.defaults.baseURL}/api/v1/together`;

export const createTogether = async (togetherDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/`, togetherDTO);
    return response.data;
  } catch (error) {
    console.error("같이요 게시글 생성에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const readTogether = async (id) => {
  try {
    const response = await axiosInstance.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("같이요 게시글 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const updateTogether = async (id, togetherDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, togetherDTO);
    return response.data;
  } catch (error) {
    console.error("같이요 게시글 수정에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const deleteTogether = async (id) => {
  try {
    const response = await jwtAxios.delete(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("같이요 게시글 삭제에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const listAllTogethers = async (params) => {
  try {
    const response = await axiosInstance.get(`${host}/`, { params });
    return response.data;
  } catch (error) {
    console.error("같이요 게시글 목록 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const searchTogethers = async (params) => {
  try {
    const response = await axiosInstance.get(`${host}/search`, { params });
    return response.data;
  } catch (error) {
    console.error("같이요 게시글 검색에서 에러가 발생하였습니다.");
    throw error;
  }
};

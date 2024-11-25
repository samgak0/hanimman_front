import axios from "axios";
import axiosInstance, { axiosInsnstance } from "./axiosInstance";
import jwtAxios from "./jwtAxios";

const host = `${axiosInstance.defaults.baseURL}/api/v1/share`;

export const createShare = async (shareDTO) => {
  try {
    const response = await jwtAxios.post(`${host}/`, shareDTO);
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 생성에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const readShare = async (id) => {
  try {
    const response = await axiosInstance.get(`${host}/${id}`);
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const updateShare = async (id, shareDTO) => {
  try {
    const response = await jwtAxios.put(`${host}/${id}`, shareDTO);
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
    const response = await axiosInstance.get(`${host}/`, { params });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 목록 조회에서 에러가 발생하였습니다.");
    throw error;
  }
};

export const searchShares = async (params) => {
  try {
    const response = await axiosInstance.get(`${host}/search`, { params });
    return response.data;
  } catch (error) {
    console.error("나눠요 게시글 검색에서 에러가 발생하였습니다.");
    throw error;
  }
};

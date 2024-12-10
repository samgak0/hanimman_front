import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/markets/category`;

export const fetchCategoryData = async (categoryId) => {
  try {
    const response = await fetch(`${host}/${categoryId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw error;
  }
};

export const searchName = async (categoryId, name) => {
  try {
    const response = await fetch(`${host}/${categoryId}/${name}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search data:", error);
    throw error;
  }
};

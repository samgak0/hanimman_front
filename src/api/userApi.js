import jwtAxios from "./jwtAxios";

const host = `${jwtAxios.defaults.baseURL}/api/user-address`;

export const getAddress = async () => {
  try {
    const response = await jwtAxios.get(`${host}/select`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

import api from "../api/config";

export const create = async (request) => {
  let data = await api.post("hoursLogDriver", request).then((result) => result.data);
  return data;
};

export const getHoursLogDriver = async () => {
  let data = await api.get("hoursLogDriver").then((result)=> result.data);
  return data;
}

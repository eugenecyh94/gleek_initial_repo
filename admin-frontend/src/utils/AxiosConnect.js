import axios from "axios";

const uri = process.env.REACT_APP_SERVER_IP;
const AxiosConnect = () => {};

AxiosConnect.post = (command, req) => {
  const options = {
    method: "POST",
    url: `${uri}${command}`,
    data: req,
    withCredentials: true,
  };
  return axios(options);
};

AxiosConnect.get = (command) => {
  console.log("axios get command::", `${uri}${command}`);
  const options = {
    method: "GET",
    url: `${uri}${command}`,
    withCredentials: true,
  };
  return axios(options);
};

AxiosConnect.patch = (command, param, req) => {
  console.log("axios patch command::", `http://${uri}/${command}/${param}`);
  const options = {
    method: "PATCH",
    url: `${uri}${command}/${param}`,
    data: req,
    withCredentials: true,
  };
  return axios(options);
};

AxiosConnect.postMultiPart = (command, req) => {
  const options = {
    method: "POST",
    url: `${uri}${command}`,
    data: req,
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  };
  return axios(options);
};

AxiosConnect.delete = (command, payload) => {
  console.log("axios delete command::", `${uri}${command}`);
  const options = {
    method: "DELETE",
    url: `${uri}${command}`,
    withCredentials: true,
    data: payload,
  };
  return axios(options);
};

AxiosConnect.patchMultiPart = (command, req) => {
  const options = {
    method: "PATCH",
    url: `${uri}${command}`,
    data: req,
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  };
  return axios(options);
};

AxiosConnect.getWithParams = (command, params) => {
  const options = {
    method: "GET",
    url: `${uri}${command}`,
    data: params,
    withCredentials: true,
  };
  return axios(options);
};

export default AxiosConnect;

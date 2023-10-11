import axios from "axios";

const uri = process.env.REACT_APP_SERVER_IP;
const AxiosConnect = () => {};

AxiosConnect.post = (command, req) => {
  const options = {
    method: "POST",
    url: uri + command,
    data: req,
    withCredentials: true,
  };
  return axios(options);
};

AxiosConnect.get = (command) => {
  const options = {
    method: "GET",
    url: uri + command,
    withCredentials: true,
  };
  return axios(options);
};

AxiosConnect.patch = (command, req) => {
  const options = {
    method: "PATCH",
    url: uri + command,
    data: req,
    withCredentials: true,
  };
  console.log(options);
  return axios(options);
};

AxiosConnect.patchMultipart = (command, req) => {
  console.log(uri + command);
  const options = {
    method: "PATCH",
    url: uri + command,
    data: req,
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  };
  return axios(options);
};

AxiosConnect.delete = (command, req) => {
  const options = {
    method: "DELETE",
    url: uri + command,
    data: req, // DELETE requests may include a request body, but it's less common than with POST
    withCredentials: true,
  };
  return axios(options);
};

export default AxiosConnect;

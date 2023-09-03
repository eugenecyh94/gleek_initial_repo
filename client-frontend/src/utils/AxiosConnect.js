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

export default AxiosConnect;

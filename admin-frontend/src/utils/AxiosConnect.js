import axios from "axios";

const uri = process.env.REACT_APP_SERVER_IP;
const AxiosConnect = () => {};

AxiosConnect.post = (command, req) => {
  const options = {
    method: "POST",
    url: uri + command,
    data: req,
  };
  return axios(options);
};

AxiosConnect.get = (command, token) => {
  console.log("axios get command::", `http://${uri}/${command}`);
  const options = {
    method: "GET",
    url: `${uri}/${command}`,
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(options);
};

export default AxiosConnect;

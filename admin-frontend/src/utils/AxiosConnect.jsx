import axios from "axios";

const uri = process.env.REACT_APP_SERVER_IP;
const AxiosConnect = () => {};

AxiosConnect.post = (command, req) => {
  const options = {
    method: "POST",
    url: `${uri}${command}`,
    data: req,
  };
  return axios(options);
};

AxiosConnect.get = (command) => {
  console.log("axios get command::", `${uri}${command}`);
  const options = {
    method: "GET",
    url: `${uri}${command}`,
  };
  return axios(options);
};

export default AxiosConnect;

import AxiosConnect from "../utils/AxiosConnect";

export const changePassword = async (oldPassword, newPassword) => {
  try {
    await AxiosConnect.post("/gleek/auth/change-password", {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
    alert("Password changed successfully.");
  } catch (error) {
    console.error(error);
    alert(error.response.data);
  }
};

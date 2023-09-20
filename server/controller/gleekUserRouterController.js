import { validateToken } from "./clientController.js";
import { validateToken as validateTokenVendor } from "./vendorController.js";

export const userRouter = async (req, res) => {
  const userRole = req.cookies.userRole;
  if (userRole == "Client") {
    const result = await validateToken(req, res);
    return result;
  } else if (userRole == "Vendor") {
    const result = await validateTokenVendor(req, res);
    return result;
  } else {
    return res.status(401).send("Invalid token");
  }
};

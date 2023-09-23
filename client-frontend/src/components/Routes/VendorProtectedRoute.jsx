import React, { useEffect, useState } from "react";
import AxiosConnect from "../../utils/AxiosConnect";
import useVendorStore from "../../zustand/VendorStore";
import useGlobalStore from "../../zustand/GlobalStore";
import { useNavigate } from "react-router-dom";

const VendorProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setVendor, setVendorAuthenticated, vendorAuthenticated, vendor } =
    useVendorStore();
  const { role, setRole } = useGlobalStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await AxiosConnect.post("/gleek/vendor/validateToken");
        setVendorAuthenticated(true);
        setVendor(response.data.vendor);
        setRole("Vendor");
      } catch (error) {
        setVendorAuthenticated(false);
        setVendor(null);
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return null;
  }

  return vendorAuthenticated ? <div>{children}</div> : null;
};

export default VendorProtectedRoute;

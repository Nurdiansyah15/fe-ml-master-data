// ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../redux/features/authSlice";

const ProtectedPage = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getUserInfo());
  }, []);

  // if (!token) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return children;
};

export default ProtectedPage;

import Loader from "./Loader";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hookStore";
import { routeAuth } from "../utils/Routes";

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.user);
  const isLoading = useAppSelector((state) => state.loader.isLoading);

  if (isLoading) return <Loader />;
  return user?.email ? <Outlet /> : <Navigate to={routeAuth} replace />;
}
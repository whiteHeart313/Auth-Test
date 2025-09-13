// Utils
import { ACCESS_TOKEN_COOKIE_NAME } from "@/utils/constants.util";
import Cookies from "js-cookie";
import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

export interface IProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }) => {
	const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);

	return <>{token ? children : <Navigate to="/auth/login" />}</>;
};

export default ProtectedRoute;
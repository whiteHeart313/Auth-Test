// Utils
import { ACCESS_TOKEN_COOKIE_NAME } from "@/utils/constants.util";
import Cookies from "js-cookie";
import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

export interface IGuestRouteProps {
	children: ReactNode;
}

const GuestRoute: FC<IGuestRouteProps> = ({ children }) => {
	const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);

	return <>{token ? <Navigate to="/" /> : children}</>;
};

export default GuestRoute;

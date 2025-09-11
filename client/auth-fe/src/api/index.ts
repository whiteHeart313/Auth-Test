// Utils
import { ACCESS_TOKEN_COOKIE_NAME, API_URL } from "@/utils/constants.util";
import axios from "axios";
import Cookies from "js-cookie";

const api = () => {
	const UserToken = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);

	return axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${UserToken}`
		},
		withCredentials: true
	});
};

export default api;

// Utils
import { ACCESS_TOKEN_COOKIE_NAME, API_URL } from "@/utils/constants.util";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = () => {
	const UserToken = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);

	const instance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${UserToken}`
		},
		withCredentials: true
	});

	// Add response interceptor to handle errors globally
	instance.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.response) {
				const status = error.response.status;
				const data = error.response.data as { message: string };
				
				if (status === 401) {
					toast.error(data?.message || "Session expired. Please login again.");
					Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
					window.location.href = "/auth/login";
				} else if (status === 403) {
					toast.error(data?.message || "You don't have permission to perform this action.");
				} else {
					const errorMessage = data?.message  || "Something went wrong. Please try again.";
					toast.error(errorMessage);
				}
			} else if (error.request) {
				// The request was made but no response was received
				toast.error("Network error. Please check your connection.");
			} else {
				// Something happened in setting up the request
				toast.error("An error occurred. Please try again.");
			}
			
			return Promise.reject(error);
		}
	);

	return instance;
};

export default api;

import api from ".";

export const loginAPI = async (email: string, password: string) => {
	return (
		await api().post(`/auth/login`, {
			email,
			password
		})
	).data;
};
export const signUpAPI = async (name: string, email: string, password: string) => {
	return (
		await api().post(`/auth/signup`, {
			name,
			email,
			password
		})
	).data;
}
export const getNewAccessTokenAPI = async () => {
	return (await api().post(`/auth/refresh-token`)).data;
};

export const getUserByTokenAPI = async () => {
	return (await api().get(`/auth/get-user`)).data;
};
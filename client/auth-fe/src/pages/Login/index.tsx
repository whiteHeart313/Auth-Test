// API
import { loginAPI } from "@/api/auth.api";
// Schema
import { loginSchema } from "@/schema/auth.schema";
import Button from "@/shared/Button";
import Checkbox from "@/shared/Checkbox";
// Components
import Input from "@/shared/Input";
import { useUser } from "@/context/UserContext";
// Utils
import { ACCESS_TOKEN_COOKIE_NAME } from "@/utils/constants.util";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { type FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const { setUser, setNewLogin } = useUser();

	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: ({ email, pass }: { email: string; pass: string }) => loginAPI(email, pass),
		onSuccess: (data : { data: { accessToken: string; user: { name : string , email : string } } }) => {
			Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.data.accessToken, {
				expires: 5
			});

			setUser(data.data.user);
			setNewLogin(true);

			toast.success("Logged in successfully | Redirecting... 🚀");
			navigate("/");
		}
	});

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { error } = loginSchema.validate(formData);
		if (error) return toast.error(error.message);
        mutate({
			email: formData.email,
			pass: formData.password
		});
        
	};

	return (
		<div className="mt-14">
			<div className="text-xs font-semibold text-black sm:text-sm">Login to your Account</div>
			<div className="mt-3 text-body-sm text-paragraph sm:text-body-lg">
				Welcome Back! log in now ✌️
			</div>

			<form
				autoComplete="off"
				onSubmit={handleLogin}>
				<div className="mt-5">
					<Input
						label="Email"
						icon="Mail"
						onChange={(val : string) =>
							setFormData({
								...formData,
								email: val
							})
						}
					/>
				</div>
				<div className="mt-5">
					<Input
						type="password"
						label="Password"
						icon="Lock"
						onChange={(val : string) => setFormData({ ...formData, password: val })}
					/>
				</div>

				<div className="mt-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Checkbox />
						<label className="text-body-sm text-paragraph">Remember me</label>
					</div>

					
				</div>

				<Button
					buttonType="submit"
					text="Login"
					className="mt-6 w-full"
					loading={isPending}
				/>

				<div className="mt-4 text-center text-body-sm text-paragraph">
					Don't have an account?{" "}
					<Link
						to="/auth/signUp"
						className="text-body-sm text-primary-700">
						Sign Up now 
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Login;

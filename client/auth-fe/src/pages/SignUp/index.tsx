import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/utils/constants.util";
import { signUpAPI } from "@/api/auth.api";
import Button from "@/shared/Button";
import { useUser } from "@/context/UserContext";
// Components
import Input from "@/shared/Input";
import { Link } from "react-router-dom";
// Schema
import { signUpSchema } from "@/schema/auth.schema";


const SignUp =  ()=> {

    const navigate = useNavigate();
    const { setUser, setNewLogin } = useUser();

	const [formData, setFormData] = useState({
		email: "",
        name: "", 
		password: ""
	});

    const { mutate, isPending } = useMutation({
		mutationKey: ["signUp"],
		mutationFn: ({ name, email, pass }: { name: string; email: string; pass: string }) => signUpAPI(name, email, pass),
		onSuccess: (data : { data: { accessToken: string; user: { name: string; email: string } } }) => {
			Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.data.accessToken, {
				expires: 5
			});
			// Use UserContext to manage user data
			setUser(data.data.user);
			setNewLogin(true);

			toast.success("Sign up successfully | Redirecting... 🚀");
			navigate("/");
		}
	});

	const handleSignUp = async (e: FormEvent<HTMLFormElement>)=> {
		e.preventDefault();
		
		const { error } = signUpSchema.validate(formData);
		if (error) return toast.error(error.message);
		
		mutate({
			name: formData.name,
			email: formData.email,
			pass: formData.password
		});
	}

	return (
		<div className="mt-14">
			<div className="text-xs font-semibold text-black sm:text-sm">Create your account now 
			</div>
			<div className="mt-3 text-body-sm text-paragraph sm:text-body-lg">
				Sign up now ✌️
			</div>

			<form
				autoComplete="off"
				onSubmit={handleSignUp}>
				<div className="mt-5">
					<Input
						label="Name"
						icon="User"
						onChange={(val : string) =>
							setFormData({
								...formData,
								name: val
							})
						}
					/>
				</div>
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

				<Button
					buttonType="submit"
					text="Sign Up"
					className="mt-6 w-full"
					loading={isPending}
				/>

				<div className="mt-4 text-center text-body-sm text-paragraph">
					Already have an account?{" "}
					<Link
						to="/auth/login"
						className="text-body-sm text-primary-700">
						Login now 
					</Link>
				</div>
			</form>
		</div>
	);

}

export default SignUp
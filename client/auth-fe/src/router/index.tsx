import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthLayout  from '@/Layout/AuthLayout'
import GuestRoute from '@/guards/GuestRoute'
import Login from "@/pages/Login";
import LoginIllustration from "@/assets/media/webp/illustration-2.webp";
import SignUpIllustration from "@/assets/media/webp/illustration.webp";
import SignUp from "@/pages/SignUp";

export const router = createBrowserRouter([
    {
        path: "auth",
		element: (
			<GuestRoute>
				<AuthLayout/>
			</GuestRoute>
		),
		children: [
            {
                path: "signUp",
                element: <SignUp />,
				handle: {
					illustration: SignUpIllustration
				}
            },
			{
				index: true,
				element: (
					<Navigate
						to="/auth/login"
						replace
					/>
				)
			},
			{
				path: "login",
				element: <Login />,
				handle: {
					illustration: LoginIllustration
				}
			},
		]
    }
])

const Router = () => {
	return <RouterProvider router={router} />;
};

export default Router;
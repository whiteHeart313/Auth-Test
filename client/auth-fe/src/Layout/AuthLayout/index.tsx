// Assets
import clsx from "clsx";
import { Outlet, useMatches } from "react-router-dom";

import Logo from "@/assets/media/svg/Logo.svg";

const AuthLayout = () => {
	const matches = useMatches();

	const [illustration] = matches
		.filter((match: any) => Boolean(match.handle?.illustration))
		.map((match: any) => match.handle.illustration);


	return (
		<div className="grid grid-cols-1 lg:grid-cols-2">
			<div className="flex min-h-screen w-full items-center justify-center bg-white">
				<div className="box-content w-full max-w-xl px-12">
					<img
						src={Logo}
						alt="Logo"
						className="h-auto w-56"
					/>
					<Outlet />
				</div>
			</div>
			<div
				className={clsx("hidden min-h-screen w-full items-center justify-center lg:flex", {
					"bg-primary-600": true ,
					"bg-[#3384e8]": true
				})}>
				<img
					src={illustration}
					alt="Illustration"
					className={clsx("w-auto animate-float rounded-3xl", {
						"max-h-[700px] max-w-[80%]": true ,
						"w-full": true 
					})}
				/>
			</div>
		</div>
	);
};

export default AuthLayout;

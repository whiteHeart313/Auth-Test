import Logo from "@/assets/media/svg/logo.svg";
import Button from "@/shared/Button";
import { useUser } from "@/context/UserContext";
import { logout } from "@/utils/auth.util";
import { useNavigate } from "react-router-dom";


const Landing = () => {
    const { user, clearUser } = useUser();
	const navigate = useNavigate();

  const handleLogout = () => {
    logout(clearUser);
    navigate("/auth/login");
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className=" shadow-[0px_4px_15px_rgba(54,62,78,0.15)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src={Logo} alt="EasyGenerator" className="h-10 w-auto" />
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              text="Logout" 
              className="!min-w-0 !bg-orange-500 hover:!bg-orange-600" 
              rounded 
              medium 
              onClick={handleLogout} 
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Welcome to the application.</h1>
        </div>
      </section>
    </div>
  );
};

export default Landing;
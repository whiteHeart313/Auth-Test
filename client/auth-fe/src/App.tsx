// Router
import Router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

// Create a client
const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<Toaster position="top-center" toastOptions={{ duration: 3000 }} />
				<Router />
			</UserProvider>
		</QueryClientProvider>
	);
};

export default App;

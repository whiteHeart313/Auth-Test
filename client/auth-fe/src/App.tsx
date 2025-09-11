// Router
import Router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext";

// Create a client
const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<Router />
			</UserProvider>
		</QueryClientProvider>
	);
};

export default App;

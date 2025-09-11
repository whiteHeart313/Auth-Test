import { ACCESS_TOKEN_COOKIE_NAME } from "./constants.util";
import Cookies from "js-cookie";

/**
 * Logout function that removes user data from cookies and redirects to login page
 */
export const logout = (clearUser: () => void) => {
  // Clear the access token cookie
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
  
  // Use the clearUser function from UserContext to clear all user data
  clearUser();
  
  // Redirect to login page
  window.location.href = "/auth/login";
};
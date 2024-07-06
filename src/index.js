import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PlayersList from "./components/PlayersList";
import PlayersTeams from "./components/PlayersTeams";
import App from "./App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { Navigate } from "react-router-dom";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Implement your authentication logic here, such as checking if the user is logged in
  // Return true if authenticated, false otherwise
  // For demonstration purposes, let's assume the user is authenticated if there's a token in localStorage
  return !!localStorage.getItem('token');
};

// PrivateRoute component to handle private routes
const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/signup",    
    element: <PrivateRoute element={<Signup />} />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute element={<App />} />,
  },
  {
    path: "/playerslist",
    element: <PrivateRoute element={<PlayersList />} />,
  },
  {
    path: "/teams",
    element: <PrivateRoute element={<PlayersTeams />} />,
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

import { Dashboard } from "../views/Dashboard";
import Login from "../views/Login";

export const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Dashboard />
  }
]
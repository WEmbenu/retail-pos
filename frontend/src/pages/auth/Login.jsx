import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { ShoppingCart, Lock } from "lucide-react";
import { useAuth, ROLES } from "../../context/AuthContext";
import { Input } from "../../components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll use hardcoded users
      if (email === "admin@example.com" && password === "admin123") {
        login({
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: ROLES.ADMIN,
        });
        navigate("/dashboard");
        enqueueSnackbar("Welcome, Admin!", { variant: "success" });
      } else if (email === "manager@example.com" && password === "manager123") {
        login({
          id: 2,
          name: "Manager User",
          email: "manager@example.com",
          role: ROLES.MANAGER,
        });
        navigate("/dashboard");
        enqueueSnackbar("Welcome, Manager!", { variant: "success" });
      } else if (email === "cashier@example.com" && password === "cashier123") {
        login({
          id: 3,
          name: "Cashier User",
          email: "cashier@example.com",
          role: ROLES.CASHIER,
        });
        navigate("/pos");
        enqueueSnackbar("Welcome, Cashier!", { variant: "success" });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Retail POS System
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock
                  className="h-5 w-5 text-primary-500 group-hover:text-primary-400"
                  aria-hidden="true"
                />
              </span>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Demo Accounts:
            </p>
            <div className="space-y-1">
              <p>
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
              <p>
                <strong>Manager:</strong> manager@example.com / manager123
              </p>
              <p>
                <strong>Cashier:</strong> cashier@example.com / cashier123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import LoadingPage from "../../components/global/LoadingPage";
import { loginUser } from "../../redux/thunks/authThunk";
import { useNavigate, useLocation } from "react-router-dom";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setLoading(true);
    if (token) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    setLoading(false);
    setCheckingAuth(false);
  }, [token, navigate, location]);

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(loginUser(data))
      .unwrap()
      .then(() => {
        setError(null);
        navigate("/");
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  if (checkingAuth || loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex h-screen bg-gray-800 text-white p-5 justify-center items-center">
      <div className="w-full max-w-md p-8 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>

        {error && (
          <div className="mb-5 bg-red-500 text-white p-3 rounded text-center">
            {error.error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username Field */}
          <div>
            <Controller
              name="username"
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <Input
                  {...field}
                  id="username"
                  label="Username"
                  type="text"
                  className="bg-gray-800 text-white"
                  aria-label="Username"
                  aria-invalid={!!errors.username}
                />
              )}
            />
            {errors.username && (
              <p className="text-warning text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Controller
              name="password"
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  className="bg-gray-800 text-white"
                  aria-label="Password"
                  aria-invalid={!!errors.password}
                />
              )}
            />
            {errors.password && (
              <p className="text-warning text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-white"
            size="lg"
            color="primary"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

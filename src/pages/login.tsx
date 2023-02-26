import Link from "next/link";
import { useRouter } from "next/router";
import LoginPassword from "../components/LoginPassword";
import useAuthCheck from "../hooks/use-auth-check";
import { api } from "../utils/api";
import { signInUserWithPassword } from "../utils/auth";

const LoginPage = () => {
  const router = useRouter();
  const { redirectedFrom } = router.query;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const getUserQuery = api.useContext().user.user.prefetch;

  useAuthCheck(redirectedFrom as string);

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mb-6 sm:mx-auto sm:w-full  sm:max-w-md">
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up for an account today
          </Link>
        </p>
      </div>
      <LoginPassword
        buttonText="Sign in"
        redirectTo="/dashboard"
        onSubmitHandler={signInUserWithPassword(getUserQuery)}
      />
      <Link href="/reset-password">
        <p className="mt-4 text-sm text-indigo-600">Forgot Your Password?</p>
      </Link>
    </div>
  );
};

export default LoginPage;

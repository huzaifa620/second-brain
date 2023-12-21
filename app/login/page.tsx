import Form from "./form";

type Props = {};

const Login = (props: Props) => {
  return (
    <div className="w-full h-screen outline-none flex flex-col gap-5 items-center p-6 mt-[10%]">
      <div className="flex flex-col items-center justify-center px-5">
        <h1
          className="text-3xl font-bold text-center"
        >
          Login
        </h1>
        <h2
          className="opacity-50 text-center"
        >
          Welcome back
        </h2>
      </div>
      <div className="shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white dark:bg-[#00121f] border border-black/10 dark:border-white/25 max-w-md w-full p-5 sm:p-10 text-left">
        <Form />
      </div>
    </div>
  );
};

export default Login;

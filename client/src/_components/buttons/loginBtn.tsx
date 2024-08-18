import { buttonVariants } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "@/../utils/globalContext";

const LoginBtn = () => {
  const { loading, setLoading } = useGlobalContext();

  return !loading ? (
    <Link
      to={"/login"}
      className={
        "group flex justify-between items-center hover:w-auto w-10 h-10 gap-1 !px-2 !py-2 rounded-full transition-all duration-200 ease-in-out mr-10 " +
        buttonVariants({ variant: "outline" })
      }
      onClick={() => setLoading(true)}
    >
      <LogIn />
      <div className="overflow-hidden w-0 group-hover:w-10 transition-all duration-200 ease-in-out">
        Login
      </div>
    </Link>
  ) : (
    <span className="loading loading-spinner loading-lg bg-white"></span>
  );
};

export default LoginBtn;

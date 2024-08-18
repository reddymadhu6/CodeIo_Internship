import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "./profileMenu";
import Logo from "/bmsce.png";
import { ModeToggle } from "../mode-toggle";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { UserProps } from "@/../types";
import LoginBtn from "../buttons/loginBtn";

const NavBar = () => {
  const user: UserProps | null = useAuthUser();
  const url = useLocation();

  return (
    <nav className="top-0 bg-muted-foreground py-3 px-5 border-b z-10 fixed flex sm:flex-row gap-2 sm:gap-0 items-center justify-between w-screen pr-10 rounded-bl-lg rounded-br-lg">
      <div className="flex gap-2 items-center text-primary-foreground text-3xl">
        <Link to={"/"}>
          <img
            src={Logo}
            alt={"Corvid Logo"}
            height={80}
            width={80}
            className="rounded-full"
          />
        </Link>
        <h1 className="select-none">BMSCE CIE MARKS & ATTENDANCE</h1>
      </div>
      {user ? <ProfileMenu /> : url.pathname !== "/login" ? <LoginBtn /> : null}
      <ModeToggle className="absolute mr-6 top-8 right-3 rounded-full overflow-hidden z-20 " />
    </nav>
  );
};

export default NavBar;

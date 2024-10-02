import { Link } from "react-router-dom";

interface AuthSwitcherProps {
  text: string;
  href: string;
  page: string;
}
const AuthSwitcher = ({ text, href, page }: AuthSwitcherProps) => {
  return (
    <>
      <Link to={href}>
        <div className="text-[#ffff] text-sm mt-2 text-white underline font-normal flex justify-center items-center">
          <span className="">{text}</span>
          <span className="pl-1">{page}</span>
        </div>
      </Link>
    </>
  );
};

export default AuthSwitcher;

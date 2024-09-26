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
        <p className="text-[#ffff] text-sm mt-2 text-white underline">
          {text}
          {page}
        </p>
      </Link>
    </>
  );
};

export default AuthSwitcher;

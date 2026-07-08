import { Link } from 'react-router-dom';
import IMG from "../../../assets/icons/worksphere.png"

const AuthHeader = () => {
  return (
    <header className="flex justify-between items-center w-full">
      <Link
        to="/login"
        className="flex items-center gap-2 text-xl sm:text-2xl font-black text-indigo-600 select-none no-underline"
      >
        <img src={IMG} alt="W" className="w-8 h-8" />
        WorkSphere
      </Link>
    </header>
  );
};

export default AuthHeader;

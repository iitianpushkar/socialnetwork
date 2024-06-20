import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
  const [state, setState] = useContext(UserContext);

  const logout = () => {
    window.localStorage.removeItem("auth");
    router.push("/login");
  };

  return (
    <ul className="nav bg-dark d-flex justify-content-between ">
      <Link href="/" className="nav-link text-light">
        FaceON
      </Link>

      

      {state == null ? (
        <>
          <Link href="/login" className="nav-link text-light">
            login
          </Link>

          <Link href="/register" className="nav-link text-light">
            register
          </Link>
        </>
      ) : (
        <>
          <div className="dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {state&&state.user&&state.user.name}
        </button>
        <ul className="dropdown-menu">
          <li>
          <Link href="/dashboard" className="nav-link dropdown-item text-dark">
        dashboard
          </Link>
          </li>
          <li>
          <a
            onClick={logout}
            className="nav-link text-dark"
            style={{ cursor: "pointer" }}
          >
            Logout
          </a>
          </li>
          <li>
          <Link href="/user/profile/update" className="nav-link dropdown-item text-dark">
        profile
          </Link>
          </li>
        </ul>
      </div>
        </>
      )}
    </ul>
  );
};

export default Nav;

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// images
import noPhoto from "../../../assets/images/no-photo.webp";

function Navbar() {
  const [transparency, setTransparency] = useState(true);

  const onScroll = useCallback(() => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 10) setTransparency(false);
    else setTransparency(true);
  }, [setTransparency]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <header
      className={`fixed top-3 left-[50%] -translate-x-[50%] transition-all  duration-300 ease-in-out ${
        transparency ? "w-[99%]" : "w-[90%] xs:w-[95%]"
      }`}
    >
      <div
        className={`relative backdrop-blur-[8px] rounded-[100px] flex w-full justify-between py-3 px-5 xs:px-3 `}
      >
        <div
          className={` absolute w-full h-full top-0 left-0 rounded-[100px] opacity-70 ${
            transparency ? "" : "bg-light-alter dark:bg-dark-alter"
          }`}
        ></div>
        <Link to="/" className="z-10 flex gap-2 items-center">
          LOGO
          <h1 className="primary uppercase text-xl">Sito Wallet</h1>
        </Link>
        <nav className="z-10">
          <Link to="/profile">
            <img
              src={noPhoto}
              alt="user-photo"
              className="rounded-full w-10 h-10 object-contain"
            />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

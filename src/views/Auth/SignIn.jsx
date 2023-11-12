import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @sito/ui
import {
  useNotification,
  Loading,
  InputControl,
  IconButton,
  Button,
  Switcher,
} from "@sito/ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faUser } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../providers/UserProvider";

// components
import ModeButton from "../../components/ModeButton/ModeButton";

// services
import { login } from "../../services/auth";

// images
// import logo from "../../assets/images/logo.png";

function SignIn() {
  const { setNotificationState } = useNotification();

  const [user, setUser] = useState("");
  const [userHelperText, setUserHelperText] = useState("");

  const handleUser = (e) => setUser(e.target.value);

  const [remember, setRemember] = useState(false);

  const handleRemember = () => setRemember((oldValue) => !oldValue);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const navigate = useNavigate();

  const { setUserState } = useUser();

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setUserHelperText("");
      setPasswordHelperText("");

      if (!user.length) {
        document.getElementById("user")?.focus();
        setUserHelperText("Debes introducir un usuario");
        return;
      }
      if (!password.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText("Debes introducir tu contraseña");
        return;
      }
      setLoading(true);
      const response = await login(user, password, remember);
      const { data, error } = response;
      if (error && error !== null)
        setNotificationState({ type: "error", message: error.message });
      else {
        setUserState({
          type: "logged-in",
          user: data.user,
        });
        navigate("/");
      }
      setLoading(false);
    },
    [user, password, setNotificationState, navigate, remember, setUserState]
  );

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <ModeButton className="top-1 right-1 icon-button primary" />
      <div
        className={`pointer-events-none fixed top-0 left-0 z-10 w-full h-screen flex items-center dark:bg-dark-drawer-background bg-light-background-placeholder backdrop-blur-sm transition-all duration-100 ${
          loading ? "opacity-100" : "opacity-0"
        }`}
      >
        <Loading
          className={`bg-white transition-all duration-300 !h-[100px] ${
            loading ? "scale-y-100" : "scale-y-0"
          }`}
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="rounded-sm appear relative bg-light-background dark:bg-dark-background2 p-10 min-w-[440px] flex flex-col gap-3 shadow-xl shadow-dark-[black]"
      >
        <div className="flex gap-2 items-center">
          {/* <img src={logo} alt="stick notes logo" className="w-10 h-10" /> */}
          LOGO
          <h1 className="text-sdark dark:text-secondary uppercase">
            Sito Notas
          </h1>
        </div>
        <InputControl
          id="user"
          label="Correo electrónico"
          className="input border-none submit !pl-8 w-full"
          value={user}
          onChange={handleUser}
          leftComponent={
            <FontAwesomeIcon
              className="absolute text-secondary top-[50%] -translate-y-[50%] left-3"
              icon={faUser}
            />
          }
          helperText={userHelperText}
        />
        <InputControl
          id="password"
          className="input border-none submit !pl-8 w-full"
          value={password}
          onChange={handlePassword}
          type={!showPassword ? "password" : "text"}
          label="Contraseña"
          leftComponent={
            <IconButton
              tabIndex={-1}
              name="toggle-see-password"
              onClick={toggleShowPassword}
              icon={showPassword ? faLockOpen : faLock}
              className="absolute text-secondary top-[50%] -translate-y-[50%] left-3 !p-0 -ml-[12px]"
              aria-label="click para alternar ver/ocultar contraseña"
            />
          }
          helperText={passwordHelperText}
        />
        <Switcher
          id="remember"
          value={remember}
          onChange={handleRemember}
          label="Recordarme"
          className="dark:text-white"
        />
        <p className="dark:text-white">
          ¿No tienes cuenta?{" "}
          <Link
            to="/auth/sign-up"
            className="underline hover:text-sdark dark:hover:text-secondary"
          >
            Registrarme
          </Link>
        </p>
        <div className="w-full flex gap-5 justify-end items-center">
          <Button
            name="login"
            type="submit"
            aria-label="Click para entrar"
            className="secondary submit"
          >
            Siguiente
          </Button>
        </div>
      </form>
    </main>
  );
}

export default SignIn;

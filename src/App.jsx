import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";

// layouts
import Auth from "./layouts/Auth";
import View from "./layouts/View/View";

// @sito/ui
import { Handler, Loading, Notification, useNotification } from "@sito/ui";

// services
import { refresh, validateUser } from "./services/auth";

// context
import { useUser } from "./providers/UserProvider";

// auth cache
import {
  cachedUser,
  getUser,
  logoutUser,
  remember,
  saveUser,
} from "./utils/auth";

// lang
import { showError } from "./lang/es";
import { fetchAccounts } from "./services/account";

// views
const SignIn = loadable(() => import("./views/Auth/SignIn"));
const SignOut = loadable(() => import("./views/Auth/SignOut"));
const SignUp = loadable(() => import("./views/Auth/SignUp"));
const Home = loadable(() => import("./views/Home/Home"));
const NotFound = loadable(() => import("./views/NotFound/NotFound"));
const Settings = loadable(() => import("./views/Settings/Settings"));

function App() {
  const { setUserState } = useUser();
  const { setNotification } = useNotification();

  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data, error } = await validateUser();
      if (error && error !== null && cachedUser()) {
        if (error.message === "invalid claim: missing sub claim") {
          const rememberValue = remember();
          if (rememberValue !== null) {
            const response = await refresh(
              getUser().user.email,
              rememberValue()
            );
            const { data, error } = response;
            if (error && error !== null) {
              logoutUser();
              setNotification({
                type: "error",
                message: showError(error.message),
              });
              return;
            }
            setUserState({
              type: "logged-in",
              user: data.user,
              photo: data.photo ?? {},
            });
            saveUser({
              user: data.user,
              photo: data.photo ?? {},
            });
          } else logoutUser();
        } else
          setUserState({ type: "logged-in", user: getUser(), cached: true });
      } else {
        // fetch last account
        let lastAccount = undefined;
        const account = await fetchAccounts({
          sort: ["updated_at"],
          user: data.user.id,
        });
        if (account.error && account.error !== null) {
          setNotification({
            type: "error",
            message: showError(account.error.message),
          });
          setLoading(false);
          logoutUser();
          return;
        } else lastAccount = account.data[0];
        console.log(lastAccount);
        saveUser({
          ...getUser(),
          user: data.user,
          account: lastAccount,
          cached: false,
        });
        setUserState({ type: "logged-in", user: data.user });
      }
    } catch (err) {
      logoutUser();
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense>
      <Handler>
        <Notification />
        {!loading ? (
          <BrowserRouter>
            <Routes>
              <Route exact path="/auth" element={<Auth />}>
                <Route index element={<SignIn />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
              </Route>
              <Route path="/" element={<View />}>
                <Route index element={<Home />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route exact path="/sign-out" element={<SignOut />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        ) : (
          <Loading className="w-full h-screen fixed top-0 left-0 z-40 bg-light-alter dark:bg-dark-alter" />
        )}
      </Handler>
    </Suspense>
  );
}

export default App;

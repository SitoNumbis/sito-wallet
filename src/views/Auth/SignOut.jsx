import { useEffect } from "react";

// @sito/ui
import { Loading } from "@sito/ui";

// contexts
import { useUser } from "../../providers/UserProvider";

// services
import { signOutUser } from "../../services/auth";

function SignOut() {
  const { setUserState } = useUser();

  const signOut = async () => {
    const error = await signOutUser();
    if (error && error !== null) console.error(error);
    setUserState({ type: "logged-out" });
  };

  useEffect(() => {
    signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loading className="w-full h-screen" />;
}

export default SignOut;
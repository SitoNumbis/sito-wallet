import { useState } from "react";

// @sito/ui
import { Loading } from "@sito/ui";

// sections
import Bills from "./sections/Bills";
import Header from "./sections/Header";
import Wallet from "./sections/Wallet";
import Footer from "./sections/Footer";
import PaymentFlow from "./sections/PaymentFlow";

function Home() {
  const [sync, setSync] = useState(false);

  return (
    <main className="flex flex-col viewport">
      <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10 flex-1">
        <div
          className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
            sync ? "scale-100" : "scale-0"
          } pointer-events-none`}
        >
          <Loading className="sync rounded-full" strokeWidth="8" />
        </div>
        <Header setSync={setSync} />
        <Bills setSync={setSync} />

        <Wallet />
        <PaymentFlow />
      </div>
      <Footer />
    </main>
  );
}

export default Home;

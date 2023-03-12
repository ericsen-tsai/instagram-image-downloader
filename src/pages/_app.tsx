import { type AppType } from "next/app";
import { Sono } from "@next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const sono = Sono({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={sono.className}>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);

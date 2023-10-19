/* Import Components */
import { Root } from "postcss";
import { Metadata } from "next";
import Navbar from "@components/nav";

/* Import Global Variables */
import { isLoggedIn } from "@utils/isLoggedIn";

export const metadata: Metadata = {
  title: "Transcendence",
  description: "The Pong Experience",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container_full_background">
        {true && <Navbar />}
        {children}
      </body>
    </html>
  );
}

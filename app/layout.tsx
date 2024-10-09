import type { Metadata } from "next";
import "@/styles/globals.css";
import { fontMono, fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { FloatingLogout } from "@/components/logout";
import { Authenticated } from "@/components/auth";

export const metadata: Metadata = {
  title: "Vault",
  description: "Password Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable}`}>
        <Navbar />
        <Authenticated>
          <FloatingLogout />
        </Authenticated>
        {children}
      </body>
    </html>
  );
}
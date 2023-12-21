import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to access you second brain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

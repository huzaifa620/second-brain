import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Register to access Educated Change",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

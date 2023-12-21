import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
  matcher: ["/chat", "/upload", "/explore", "/user", "/settings"],
};
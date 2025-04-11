import withAuth from "next-auth/middleware";

export default withAuth(
  (req) => {
    // Note: you can add monitoring each page here
    console.log(req.nextUrl.pathname);
  },
  {
    pages: {
      signIn: "/auth",
    },
  }
);

export const config = { matcher: ["/profile"] };

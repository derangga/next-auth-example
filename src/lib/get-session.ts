import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default getSession;

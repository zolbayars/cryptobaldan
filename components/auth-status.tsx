import { unstable_getServerSession } from "next-auth/next";
import SignOut from "@/components/sign-out";

export default async function AuthStatus() {
  const session = await unstable_getServerSession();
  return (
    <div className="absolute top-5 w-full flex justify-center items-center">
      {session && (
        <div>
          <p className="text-stone-200 text-sm">
            Signed in as {session.user?.email}
          </p>
          <SignOut/>
        </div>
      )}
    </div>
  );
}

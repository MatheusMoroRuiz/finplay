import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  return (
    <>
      <Navbar />
      <h1> Subscription page</h1>
    </>
  );
};

export default SubscriptionPage;

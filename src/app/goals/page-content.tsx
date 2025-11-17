import { auth } from "@clerk/nextjs/server";
import { getGoalsByUser } from "../_data/goals";
import GoalsList from "../_components/goals/goals-list";
import CreateGoalButton from "../_components/goals/create-goal-button";
import Navbar from "../_components/navbar";

export default async function GoalsPageContent() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const goals = await getGoalsByUser(userId);

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Metas & Objetivos</h1>

          <CreateGoalButton />
        </div>

        <GoalsList goals={goals} />
      </div>
    </>
  );
}

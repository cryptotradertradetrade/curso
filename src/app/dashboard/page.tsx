import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutsByUserAndDate } from "@/lib/data/workouts";
import { DashboardClient } from "./dashboard-client";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const date = dateParam
    ? new Date(`${dateParam}T00:00:00`)
    : new Date();

  const workouts = await getWorkoutsByUserAndDate(userId, date);

  return <DashboardClient workouts={workouts} date={date} />;
}

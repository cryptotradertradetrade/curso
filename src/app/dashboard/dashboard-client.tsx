"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Workout = {
  id: string;
  name: string | null;
  startedAt: Date;
  finishedAt: Date | null;
};

type Props = {
  workouts: Workout[];
  date: Date;
};

export function DashboardClient({ workouts, date }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSelectDate(selected: Date | undefined) {
    if (selected) {
      const iso = format(selected, "yyyy-MM-dd");
      router.push(`/dashboard?date=${iso}`);
      setOpen(false);
    }
  }

  function formatDuration(start: Date, end: Date | null): string {
    if (!end) return "Em andamento";
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    return `${minutes} min`;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visualize seus treinos por data.
        </p>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs hover:bg-accent hover:text-accent-foreground">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {format(date, "dd/MM/yyyy")}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Treinos em {format(date, "dd/MM/yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum treino registrado para esta data.
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {workout.name ?? "Treino sem nome"}
                </CardTitle>
                <CardDescription>
                  Início: {format(workout.startedAt, "dd/MM/yyyy")} •{" "}
                  {formatDuration(workout.startedAt, workout.finishedAt)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import HistoryComponent from "../HistoryComponent";
import { prisma } from "@/lib/db";
import { DropdownMenu, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { progress } from "framer-motion";

import { BarChartBig } from "lucide-react";

type Props = {};

const ProgressCard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const games_count = await prisma.game.count({
    where: {
      userId: session.user.id,
      topic: "AP Physics 1",
    },
  });
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Progress Bar</CardTitle>
        <BarChartBig size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          AP US History
        </p>
      </CardContent>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You have played a total of {games_count} quizzes.
        </p>
      </CardContent>
      <CardContent className="max-h-[580px] overflow-scroll">
        <Progress value={games_count}/>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;

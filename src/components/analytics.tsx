import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AnalyticsCard from "@/components/analytics-card";

interface AnalyticsProps {
    data?: {
        taskCount: number;
        taskDifference: number;
        assignedTaskCount?: number;
        assignedTaskDifference?: number;
        completedTaskCount?: number;
        completedTaskDifference?: number;
        incompleteTaskCount: number;
        incompleteTaskDifference: number;
        overdueTaskCount: number;
        overdueTaskDifference: number;
    };
}

export const Analytics = ({ data }: AnalyticsProps) => {
    if (!data) return null;

    const cardsData = [
        {
            title: "Всего заданий",
            value: data.taskCount,
            variant: data.taskDifference > 0 ? "incr" : "decr",
            increaseValue: data.taskDifference,
        },
        {
            title: "Активные задания",
            value: data.assignedTaskCount ?? 0,
            variant: (data.assignedTaskDifference ?? 0) > 0 ? "incr" : "decr",
            increaseValue: data.assignedTaskDifference ?? 0,
        },
        {
            title: "Законченые задания",
            value: data.completedTaskCount ?? 0,
            variant: (data.completedTaskDifference ?? 0) > 0 ? "incr" : "decr",
            increaseValue: data.completedTaskDifference ?? 0,
        },
        {
            title: "Просроченные задания",
            value: data.overdueTaskCount,
            variant: data.overdueTaskDifference > 0 ? "incr" : "decr",
            increaseValue: data.overdueTaskDifference,
        },
        {
            title: "Невыполненые задания",
            value: data.incompleteTaskCount,
            variant: data.incompleteTaskDifference > 0 ? "incr" : "decr",
            increaseValue: data.incompleteTaskDifference,
        },
    ];

    return (
        <ScrollArea className="w-full rounded-lg border  shadow-sm">
            <div className="flex flex-col sm:flex-row sm:space-x-6 p-4">
                {cardsData.map(({ title, value, variant, increaseValue }) => (
                    <div key={title} className="flex-1 mb-4 last:mb-0 sm:mb-0">
                        <AnalyticsCard
                            title={title}
                            value={value}
                            variant={variant}
                            increaseValue={increaseValue}
                        />
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};
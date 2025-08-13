import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
    title: string;
    value: number;
    variant: "incr" | "decr";
    increaseValue: number;
}

const AnalyticsCard = ({
                           title,
                           value,
                           variant,
                           increaseValue,
                       }: AnalyticsCardProps) => {
    const iconColor = variant === "incr" ? "text-emerald-500" : "text-red-500";
    const increaseValueColor =
        variant === "incr" ? "text-emerald-600" : "text-red-600";
    const Icon = variant === "incr" ? FaCaretUp : FaCaretDown;

    return (
        <Card  className="shadow-md border rounded-md hover:scale-105 transition-all cursor-pointer  hover:shadow-lg  duration-300">
            <CardHeader className="flex flex-col">
                <h4 className="text-sm font-semibold text-gray-600 break-words whitespace-normal">
                    {title}
                </h4>
                <CardTitle className="text-4xl font-extrabold leading-none ">
                    {value}
                </CardTitle>
                <div
                    className={cn(
                        "flex items-center gap-1 mt-1 text-sm font-semibold",
                        increaseValueColor,
                        "transition-colors duration-300"
                    )}
                >
                    <Icon className="w-5 h-5"/>
                    <span>{increaseValue > 0 ? `+${increaseValue}` : increaseValue}</span>
                </div>
            </CardHeader>
        </Card>
    );
};

export default AnalyticsCard;

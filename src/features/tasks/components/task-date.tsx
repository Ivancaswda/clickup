import {differenceInDays, format} from "date-fns";
import {cn} from "@/lib/utils";

import {ru} from "date-fns/locale";
import moment from "moment";
import 'moment/locale/ru';

moment.locale('ru');
interface TaskDateProps {
    value: string,
    className?: string
}

export const TaskDate = ({value, className}: TaskDateProps) => {
    const today = new Date();
    const endDate = new Date(value);
    const diffInDays = differenceInDays(endDate, today);

    let textColor = 'text-gray-500'; // менее яркий, как в ClickUp
    if (diffInDays <= 3) {
        textColor = 'text-red-600 font-semibold';
    } else if (diffInDays <= 7) {
        textColor = 'text-orange-500 font-medium';
    } else if (diffInDays <= 14) {
        textColor = 'text-yellow-500 font-medium';
    }

    return (
        <div>
            <span className={cn('truncate', textColor, className)}>
                {moment(endDate).format('D MMMM YYYY')}
            </span>
        </div>
    );
}

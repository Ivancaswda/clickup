'use client'
import * as React from 'react'
import {format} from 'date-fns'
import {Calendar as CalendarIcon} from 'lucide-react'
import {cn} from '@/lib/utils'
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
    className?: string;
    placeholder?: string;
}


const DatePicker = ({value, onChange, className, placeholder = 'Select date'}: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className={cn('w-full justify-start text-left font-normal px-3', !value && 'text-muted-foreground', className)}>
                    <CalendarIcon className='mr-2 h-4 w-4'/>
                    {value ? format(value, 'PPP') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                    <Calendar selected={value} mode='single' onSelect={(date) => onChange(date as Date)}
                    initialFocus
                    />
            </PopoverContent>
        </Popover>
    )
}
export default DatePicker
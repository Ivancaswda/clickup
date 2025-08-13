import React from 'react'

interface OverviewPropertyProps {
    label: string;
    children: React.ReactNode
}

const OverviewProperty = ({label, children}: OverviewPropertyProps) => {
    return (
        <div className='flex items-center gap-x-2'>
            <div className='min-w-[100px]'>
                <p className='text-muted-foreground text-sm'>
                    {label}
                </p>
            </div>
            <div className='flex items-center gap-x-2'>
                {children}
            </div>
        </div>
    )
}
export default OverviewProperty

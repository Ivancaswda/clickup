'use client'

import { setAdapter } from 'nuqs'
import { appRouterAdapter } from 'nuqs/next'
import { useEffect } from 'react'

export function NuqsAdapterProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        setAdapter(appRouterAdapter())
    }, [])

    return <>{children}</>
}

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Helper to extract the type of props that NextThemesProvider accepts
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

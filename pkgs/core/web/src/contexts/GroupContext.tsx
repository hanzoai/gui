import { createContext } from 'react'
import type { AllGroupContexts } from '../types.tsx'

export const GroupContext = createContext<AllGroupContexts | null>(null)

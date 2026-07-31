import type { Slot } from './client';
export interface TimeSlotsProps {
    dayKey: string | null;
    slots: Slot[];
    timeZone: string;
    onPick: (iso: string) => void;
    selectedIso?: string | null;
    loading?: boolean;
    /** compact = wrap into a flowing grid instead of a tall column */
    compact?: boolean;
    maxHeight?: number;
}
/** Time-slot pills for the selected day, shown in the visitor's time zone. */
export declare function TimeSlots({ dayKey, slots, timeZone, onPick, selectedIso, loading, compact, maxHeight, }: TimeSlotsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TimeSlots.d.ts.map
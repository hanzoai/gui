export interface MonthCalendarProps {
    viewDate: Date;
    availableKeys: Set<string>;
    selectedDay: string | null;
    onSelectDay: (key: string) => void;
    onPrev: () => void;
    onNext: () => void;
    atFirstMonth: boolean;
    weekStartsOn?: 0 | 1;
    loading?: boolean;
}
/** Navigable month grid; days with availability are selectable. */
export declare function MonthCalendar({ viewDate, availableKeys, selectedDay, onSelectDay, onPrev, onNext, atFirstMonth, weekStartsOn, loading, }: MonthCalendarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MonthCalendar.d.ts.map
/** The visitor's IANA time zone, e.g. "America/New_York". */
export declare function visitorTimeZone(): string;
/** Calendar date "YYYY-MM-DD" from a Date's local components. */
export declare function ymd(d: Date): string;
export declare function startOfMonth(d: Date): Date;
export declare function addMonths(d: Date, n: number): Date;
export declare function sameMonth(a: Date, b: Date): boolean;
/** True if the day key is strictly before today (lexicographic works on YYYY-MM-DD). */
export declare function isBeforeToday(key: string): boolean;
export interface MonthCell {
    date: Date;
    key: string;
    inMonth: boolean;
}
/**
 * A 6×7 grid of days covering the month of `viewDate`, including the leading
 * and trailing days needed to fill whole weeks.
 */
export declare function monthMatrix(viewDate: Date, weekStartsOn?: number): MonthCell[];
/**
 * ISO start/end covering the visible month, clamped so the start is never in
 * the past (the backend rejects past ranges anyway).
 */
export declare function monthRange(viewDate: Date): {
    startTime: string;
    endTime: string;
};
/** Short weekday headers ordered from `weekStartsOn` (0 = Sunday). */
export declare function weekdayLabels(weekStartsOn?: number): string[];
export declare function formatMonthLabel(d: Date): string;
export declare function formatDayLong(d: Date): string;
/** Slot time in the visitor's zone, e.g. "9:00 AM". */
export declare function formatSlotTime(iso: string, timeZone: string): string;
/** Full human "when" for a confirmation, e.g. "Monday, July 27, 2026 at 9:00 AM PDT". */
export declare function formatBookingWhen(iso: string, timeZone: string): string;
/** A parsed local Date from a "YYYY-MM-DD" key (noon avoids DST edge slips). */
export declare function dateFromKey(key: string): Date;
//# sourceMappingURL=time.d.ts.map
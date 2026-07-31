import type { Booking } from './client';
export interface CalendarEmbedProps {
    host: string;
    eventSlug: string;
    apiUrl?: string;
    timeZone?: string;
    weekStartsOn?: 0 | 1;
    onBooked?: (booking: Booking) => void;
}
/**
 * Compact booking card for a marketing hero — soonest availability inline,
 * no month grid. Same state machine as <Booker>.
 */
export declare function CalendarEmbed(props: CalendarEmbedProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CalendarEmbed.d.ts.map
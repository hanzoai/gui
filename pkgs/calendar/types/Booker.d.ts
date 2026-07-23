import type { Booking } from './client';
export interface BookerProps {
    /** Host username (the calendar owner), e.g. "hanzo". */
    host: string;
    /** Event-type slug, e.g. "intro". */
    eventSlug: string;
    /** API base, defaults to https://api.hanzo.ai/v1/calendar */
    apiUrl?: string;
    /** Visitor IANA time zone; defaults to the browser/device zone. */
    timeZone?: string;
    weekStartsOn?: 0 | 1;
    onBooked?: (booking: Booking) => void;
}
/** Universal scheduling flow: event → month → times → details → confirmation. */
export declare function Booker(props: BookerProps): import("react").JSX.Element;
//# sourceMappingURL=Booker.d.ts.map
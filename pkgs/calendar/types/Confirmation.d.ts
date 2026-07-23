import { type Booking } from './client';
export interface ConfirmationProps {
    /** Provide a booking directly, or a uid to fetch one. */
    booking?: Booking;
    uid?: string;
    apiUrl?: string;
    timeZone?: string;
    onDone?: () => void;
}
/** Booking confirmation card. Accepts a booking object or fetches by uid. */
export declare function Confirmation({ booking, uid, apiUrl, timeZone, onDone, }: ConfirmationProps): import("react").JSX.Element;
//# sourceMappingURL=Confirmation.d.ts.map
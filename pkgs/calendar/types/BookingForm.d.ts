import type { BookingResponses } from './client';
export interface BookingFormProps {
    slotIso: string;
    timeZone: string;
    eventLength: number;
    submitting?: boolean;
    error?: string | null;
    onSubmit: (responses: BookingResponses) => void;
    onBack: () => void;
}
/** Attendee details form for the chosen slot. */
export declare function BookingForm({ slotIso, timeZone, eventLength, submitting, error, onSubmit, onBack, }: BookingFormProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BookingForm.d.ts.map
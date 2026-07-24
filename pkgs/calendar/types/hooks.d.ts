import { type Booking, type BookingResponses, type EventType, type SlotsByDay } from './client';
export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
export declare function useEventType(api: string, eventSlug: string, username: string): AsyncState<EventType>;
export interface SlotsQuery {
    eventTypeSlug: string;
    username: string;
    startTime: string;
    endTime: string;
    timeZone: string;
    enabled?: boolean;
}
export interface SlotsState extends AsyncState<SlotsByDay> {
    refetch: () => void;
}
export declare function useAvailableSlots(api: string, query: SlotsQuery): SlotsState;
export type SubmitResult = {
    ok: true;
    booking: Booking;
} | {
    ok: false;
    conflict: boolean;
    message: string;
};
export interface CreateBookingState {
    submit: (input: {
        eventTypeSlug: string;
        username: string;
        start: string;
        timeZone: string;
        responses: BookingResponses;
    }) => Promise<SubmitResult>;
    submitting: boolean;
    error: string | null;
    conflict: boolean;
    reset: () => void;
}
export declare function useCreateBooking(api: string): CreateBookingState;
export declare function useBooking(api: string, uid: string | undefined): AsyncState<Booking>;
//# sourceMappingURL=hooks.d.ts.map
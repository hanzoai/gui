export declare const DEFAULT_API_URL = "https://api.hanzo.ai/v1/calendar";
export declare const CAL_API_VERSION = "2024-08-13";
export interface Location {
    type?: string;
    link?: string;
    address?: string;
}
export interface Profile {
    name?: string | null;
    username?: string | null;
    image?: string | null;
    avatarUrl?: string | null;
}
export interface EventType {
    id: number;
    slug: string;
    title: string;
    description: string;
    /** duration in minutes */
    length: number;
    locations: Location[];
    price: number;
    currency: string;
    profile?: Profile;
}
export interface Slot {
    /** ISO-8601 UTC instant, e.g. "2026-07-24T16:00:00Z" */
    time: string;
}
/** Slots grouped by day key "YYYY-MM-DD" (in the requested time zone). */
export type SlotsByDay = Record<string, Slot[]>;
export interface Attendee {
    name?: string;
    email?: string;
    timeZone?: string;
}
export interface Booking {
    uid: string;
    status: string;
    start: string;
    end: string;
    title: string;
    location?: string;
    attendees?: Attendee[];
}
export interface BookingResponses {
    name: string;
    email: string;
    notes?: string;
}
export interface CreateBookingInput {
    eventTypeSlug: string;
    username: string;
    /** ISO instant of the chosen slot */
    start: string;
    timeZone: string;
    responses: BookingResponses;
}
export interface SlotsInput {
    eventTypeSlug: string;
    username: string;
    startTime: string;
    endTime: string;
    timeZone: string;
}
/** Error carrying the HTTP status; `conflict` marks a 409 (slot just taken). */
export declare class CalendarError extends Error {
    status: number;
    conflict: boolean;
    constructor(message: string, status: number);
}
export declare function fetchEventType(api: string, eventSlug: string, username: string, signal?: AbortSignal): Promise<EventType>;
export declare function fetchSlots(api: string, input: SlotsInput, signal?: AbortSignal): Promise<SlotsByDay>;
export declare function createBooking(api: string, input: CreateBookingInput, signal?: AbortSignal): Promise<Booking>;
export declare function fetchBooking(api: string, uid: string, signal?: AbortSignal): Promise<Booking>;
export declare function cancelBooking(api: string, uid: string, reason?: string, signal?: AbortSignal): Promise<Booking>;
//# sourceMappingURL=client.d.ts.map
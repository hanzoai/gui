import { type Booking, type BookingResponses, type Slot } from './client';
import { type AsyncState, type SlotsState } from './hooks';
import type { EventType } from './client';
export type BookerPhase = 'pick' | 'form' | 'done';
export interface UseBookerOptions {
    host: string;
    eventSlug: string;
    apiUrl?: string;
    timeZone?: string;
    weekStartsOn?: 0 | 1;
    onBooked?: (booking: Booking) => void;
    /** Auto-select the soonest available day (used by the compact embed). */
    autoSelectFirst?: boolean;
}
export interface BookerModel {
    api: string;
    timeZone: string;
    weekStartsOn: 0 | 1;
    event: AsyncState<EventType>;
    slots: SlotsState;
    viewDate: Date;
    availableKeys: Set<string>;
    selectedDay: string | null;
    daySlots: Slot[];
    selectedSlot: string | null;
    phase: BookerPhase;
    booking: Booking | null;
    submitting: boolean;
    error: string | null;
    conflict: boolean;
    goPrevMonth: () => void;
    goNextMonth: () => void;
    atFirstMonth: boolean;
    selectDay: (key: string) => void;
    selectSlot: (iso: string) => void;
    submit: (responses: BookingResponses) => Promise<void>;
    back: () => void;
    reset: () => void;
}
export declare function useBooker(opts: UseBookerOptions): BookerModel;
//# sourceMappingURL=useBooker.d.ts.map
import type { EventType } from './client';
export interface EventHeaderProps {
    event: EventType;
    host: string;
    timeZone: string;
    compact?: boolean;
}
/** Event identity: host, title, duration, timezone, description. */
export declare function EventHeader({ event, host, timeZone, compact }: EventHeaderProps): import("react").JSX.Element;
//# sourceMappingURL=EventHeader.d.ts.map
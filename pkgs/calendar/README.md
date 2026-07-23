# @hanzo/calendar

Universal (web + native) scheduling UI for the [Hanzo Calendar](https://api.hanzo.ai/v1/calendar), built with [hanzogui](https://github.com/hanzoai/gui) primitives.

One booking flow — event header → month grid → time slots → details → confirmation — that runs unchanged on the web (DOM) and React Native (iOS / Android). No raw HTML, no ad-hoc CSS: every surface is a hanzogui/Tamagui component styled with theme tokens, so it inherits the host app's theme, dark mode, and design system.

## Install

```sh
bun add @hanzo/calendar
# peer deps: hanzogui, react (and react-native for native targets)
```

Render inside a `GuiProvider` (from `hanzogui`) so tokens and themes resolve.

## Usage

```tsx
import { GuiProvider } from 'hanzogui'
import { Booker } from '@hanzo/calendar'
import config from './gui.config' // your createGui(...) config

export function BookMeeting() {
  return (
    <GuiProvider config={config} defaultTheme="light">
      <Booker
        host="hanzo"
        eventSlug="intro"
        onBooked={(booking) => console.log('booked', booking.uid)}
      />
    </GuiProvider>
  )
}
```

That's the whole integration. `Booker` fetches the public event type, renders a navigable month calendar, loads availability for the visible range, converts UTC slots into the visitor's time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`), collects attendee details, and posts the booking — with loading, error, empty, and "slot just taken" (HTTP 409) states handled throughout.

## Components

| Component        | Purpose                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `Booker`         | Full scheduling flow: event → month → times → details → confirmation.   |
| `CalendarEmbed`  | Compact card for a marketing hero — soonest availability inline.        |
| `Confirmation`   | Booking confirmation card; pass a `booking` or a `uid` to fetch one.    |
| `EventHeader`, `MonthCalendar`, `TimeSlots`, `BookingForm` | Composable sub-views for a custom flow. |

### Props

`Booker` and `CalendarEmbed`:

- `host` — calendar owner's username, e.g. `"hanzo"`.
- `eventSlug` — event-type slug, e.g. `"intro"`.
- `apiUrl?` — API base; defaults to `https://api.hanzo.ai/v1/calendar`.
- `timeZone?` — visitor IANA zone; defaults to the browser/device zone.
- `weekStartsOn?` — `0` (Sunday, default) or `1` (Monday).
- `onBooked?(booking)` — called with the created booking.

`Confirmation`:

- `booking?` — a booking object, or
- `uid?` — a booking id to fetch (with `apiUrl?`, `timeZone?`, `onDone?`).

## Data & time helpers

The pure, framework-free data plane (`fetchEventType`, `fetchSlots`, `createBooking`, `fetchBooking`, `cancelBooking`) and time plane (`visitorTimeZone`, `formatSlotTime`, `monthMatrix`, …) are exported for building a bespoke flow or a headless integration. The `useBooker` hook exposes the entire state machine.

## Backend

Speaks the Hanzo Calendar API (Cal API-v2 shapes):

- `GET  /atoms/event-types/{slug}/public?username={host}`
- `GET  /slots/available?eventTypeSlug=&usernameList=&startTime=&endTime=&timeZone=`
- `POST /bookings` (`cal-api-version: 2024-08-13`)
- `GET  /bookings/{uid}` · `POST /bookings/{uid}/cancel`

## License

BSD-3-Clause © Hanzo AI

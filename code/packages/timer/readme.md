[time console output screenshot](./screen.png)!

```tsx
import { timer } from '@hanzo/gui-timer'

const t = timer()

setTimeout(() => {
  t.print()
}, 3000)

function something() {
  const time = t.start()

  // do stuff...

  time`firstTag`

  // do stuff...
  time`second`
}
```

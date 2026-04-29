// CronEditor — pure logic tests for the validator and preset table.
// We do not render the component itself: hanzogui Input pulls in the
// Tamagui theme extractor at module-eval, which is wired up in the
// kitchen-sink shell, not here. Behavioural coverage that requires
// the provider lives there.

import { describe, it, expect } from 'vitest'
import { CRON_PRESETS, validateCron } from '../schedule/CronEditor'
import { describeCron, nextCronAfter } from '../../stores/schedule-recurrence'

describe('validateCron', () => {
  it('accepts standard 5-field crons', () => {
    expect(validateCron('* * * * *')).toBeNull()
    expect(validateCron('0 9 * * 1-5')).toBeNull()
    expect(validateCron('*/15 * * * *')).toBeNull()
    expect(validateCron('0,15,30,45 * * * *')).toBeNull()
  })

  it('accepts 6-field cron with seconds', () => {
    expect(validateCron('0 0 9 * * 1-5')).toBeNull()
  })

  it('accepts known @aliases', () => {
    expect(validateCron('@daily')).toBeNull()
    expect(validateCron('@hourly')).toBeNull()
    expect(validateCron('@weekly')).toBeNull()
  })

  it('rejects unknown @aliases', () => {
    expect(validateCron('@notathing')).toMatch(/unknown @alias/)
  })

  it('rejects wrong field counts', () => {
    expect(validateCron('* * *')).toMatch(/5 fields/)
    expect(validateCron('* * * *')).toMatch(/5 fields/)
    expect(validateCron('* * * * * * *')).toMatch(/5 fields/)
  })

  it('rejects malformed fields', () => {
    expect(validateCron('a * * * *')).toMatch(/bad field/)
    expect(validateCron('*/0 * * * *')).toMatch(/bad field/)
    expect(validateCron('5-1 * * * *')).toMatch(/bad field/)
  })

  it('rejects empty', () => {
    expect(validateCron('')).toMatch(/required/)
    expect(validateCron('   ')).toMatch(/required/)
  })
})

describe('CRON_PRESETS', () => {
  it('all preset values pass validation', () => {
    for (const p of CRON_PRESETS) {
      expect(validateCron(p.value)).toBeNull()
    }
  })

  it('describeCron renders something for every preset', () => {
    for (const p of CRON_PRESETS) {
      expect(describeCron(p.value)).toBeTruthy()
    }
  })

  it('preset values produce a valid next-fire time', () => {
    const anchor = Date.UTC(2026, 0, 1, 0, 0, 0)
    for (const p of CRON_PRESETS) {
      const t = nextCronAfter(p.value, anchor)
      expect(t).not.toBeNull()
      expect(typeof t).toBe('number')
      expect(t! > anchor).toBe(true)
    }
  })
})

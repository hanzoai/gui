import { startTransition } from './index'

describe('startTransition', () => {
  it('should call the callback directly if HANZO_GUI_TARGET is not web', () => {
    process.env.HANZO_GUI_TARGET = 'native'
    const callback = jest.fn()
    startTransition(callback)
    expect(callback).toHaveBeenCalled()
  })

  it('should proxy to react.startTransition if HANZO_GUI_TARGET is web', () => {
    process.env.HANZO_GUI_TARGET = 'web'
    const callback = jest.fn()
    startTransition(callback)
    // Assuming react.startTransition works as expected
    expect(callback).not.toHaveBeenCalled()
  })
})

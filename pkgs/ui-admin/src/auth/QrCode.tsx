// QrCode — render a QR code from a server-supplied data URL.
//
// Upstream uses `qrcode.react` to draw a QR client-side from an
// `otpauth://` URL. We don't bundle that dep here. Two patterns the
// host can wire:
//
//   1. Server-rendered (preferred): the IAM backend ships a base64
//      PNG/SVG data URL alongside the TOTP secret. We just paint
//      the image. This is the safest path — secrets never get
//      reformatted client-side.
//   2. Caller-supplied: the host app wraps `qrcode.react` (or any
//      QR component) and passes it as the `Renderer` prop. We hand
//      it the otpauth URL.
//
// Original at `~/work/hanzo/iam/web/src/QrCodePage.tsx`.

import type { ComponentType } from 'react'
import { Card, Image, Paragraph, YStack } from 'hanzogui'

export interface QrCodeProps {
  dataUrl?: string
  value?: string
  Renderer?: ComponentType<{ value: string; size: number }>
  size?: number
  label?: string
}

export function QrCode({ dataUrl, value, Renderer, size = 200, label }: QrCodeProps) {
  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3" items="center">
        {label ? <Paragraph color="$placeholderColor">{label}</Paragraph> : null}
        {dataUrl ? (
          <Image
            source={{ uri: dataUrl, width: size, height: size }}
            width={size}
            height={size}
          />
        ) : Renderer && value ? (
          <Renderer value={value} size={size} />
        ) : (
          <Paragraph color="$placeholderColor">No QR available.</Paragraph>
        )}
      </YStack>
    </Card>
  )
}

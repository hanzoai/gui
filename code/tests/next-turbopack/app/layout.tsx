import { HanzoguiProvider } from './provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <HanzoguiProvider>{children}</HanzoguiProvider>
      </body>
    </html>
  )
}

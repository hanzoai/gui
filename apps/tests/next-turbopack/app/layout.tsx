import { GuiProvider } from './provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GuiProvider>{children}</GuiProvider>
      </body>
    </html>
  )
}

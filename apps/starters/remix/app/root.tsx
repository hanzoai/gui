import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from 'react-router'
import { GuiProvider } from '@hanzo/gui'
import hanzoguiConfig from '../hanzogui.config'

// Zen ships with the package, so a project scaffolded from this starter makes
// no request to a font host and starts on our own family.
import '@hanzo/font/css'

export const links: LinksFunction = () => []

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GuiProvider config={hanzoguiConfig} defaultTheme="dark">
          {children}
        </GuiProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

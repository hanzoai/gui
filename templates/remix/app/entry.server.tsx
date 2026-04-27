import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import hanzoguiConfig from '../hanzogui.config'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    try {
      const hanzoguiCSS = hanzoguiConfig.getCSS()
      let markup = renderToString(
        <RemixServer context={remixContext} url={request.url} />
      )
      markup = markup.replace(
        '</head>',
        `<style id="hanzogui">${hanzoguiCSS}</style></head>`
      )

      responseHeaders.set('Content-Type', 'text/html')

      resolve(
        new Response('<!DOCTYPE html>' + markup, {
          headers: responseHeaders,
          status: responseStatusCode,
        })
      )
    } catch (error) {
      reject(error)
    }
  })
}

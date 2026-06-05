import type { Endpoint } from 'one'
import { ensureAuth } from '~/features/api/ensureAuth'
import { hasProAccess } from '~/features/recipes/hasProAccess'
import { getRecipesBundleZip } from '~/features/auth/supabaseAdmin'

export const GET: Endpoint = async (req) => {
  const { user } = await ensureAuth({ req })

  if (!user) {
    return Response.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const hasPro = await hasProAccess(user.id)
  if (!hasPro) {
    return Response.json({ error: 'not_authorized' }, { status: 401 })
  }

  try {
    const zipFile = await getRecipesBundleZip()

    // Set appropriate headers for ZIP file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/zip')
    headers.set('Content-Disposition', 'attachment; filename=recipes-bundle.zip')

    return new Response(zipFile, { headers })
  } catch (error) {
    console.error('Error getting Recipes bundle:', error)
    return Response.json({ error: 'Failed to get Recipes bundle' }, { status: 500 })
  }
}

/**
 * Legacy `supabaseAdmin` re-export.
 *
 * The module used to instantiate a Supabase service-role client and a Stripe
 * client side-by-side. Both are gone:
 *
 *   - DB/storage now flow through `features/db` (backed by @hanzo/base).
 *   - Subscription orchestration moved to hanzoai/commerce REST.
 *
 * This file keeps a tiny shim so the existing 60+ call sites continue to
 * type-check while we rewrite them. The `supabaseAdmin` export is a Proxy
 * whose `.from(table)` forwards to the Base adapter; `.storage.from(bucket)`
 * forwards to Base storage. Anything else (auth.admin, stripe expansion,
 * subscription state machine) is marked with `TODO(supabase-rip)`.
 */

import { db } from '../db'
import { storage } from '../db/storage'

type SupabaseAdminShim = {
  from: typeof db.from
  storage: { from: typeof storage.from }
  /** Authentication admin — TODO(supabase-rip): wire to IAM admin endpoints. */
  auth: {
    admin: {
      getUserById(_id: string): Promise<never>
    }
  }
}

export const supabaseAdmin: SupabaseAdminShim = {
  from: db.from,
  storage,
  auth: {
    admin: {
      async getUserById(_id: string) {
        // TODO(supabase-rip): replace with IAM admin user lookup once
        // hanzoai/iam ships an admin GET /users/{id} endpoint we can call
        // server-side. For now this throws loudly so call sites are visible.
        throw new Error(
          'supabaseAdmin.auth.admin.getUserById: not implemented in IAM port — see TODO(supabase-rip)',
        )
      },
    },
  },
}

// =============================================================================
// Storage helpers — Recipes / Bento bundle reads
// =============================================================================
//
// External bucket renamed from `bento` → `recipes` (matches the rebrand pass).

export const getRecipesCode = async (codePath: string) => {
  const { data, error } = await storage
    .from('recipes')
    .download(`merged/${codePath}.tsx`)
  if (error || !data) {
    console.error(error)
    throw new Error(`Error getting recipes code for ${codePath}`)
  }
  return data.text()
}

export const getRecipesComponentCategory = async ({
  categoryPath,
  categorySectionPath,
  fileName,
}: {
  categoryPath: string
  categorySectionPath?: string
  fileName?: string
}) => {
  let rootPath = `${categoryPath}`
  if (categorySectionPath) {
    rootPath += `/${categorySectionPath}`
  }

  const downloadPath = `unmerged/${rootPath}`

  const { data: fileList, error } = await storage.from('recipes').list(downloadPath)
  if (error || !fileList) {
    throw new Error(
      `Error getting recipes code for ${categoryPath} ${categorySectionPath ?? ''}`,
    )
  }

  const result: { [key: string]: Array<{ path: string; downloadUrl: string }> } = {}

  const processFolder = async (folderPath: string, folderName: string) => {
    const { data: subFileList, error: subError } = await storage
      .from('recipes')
      .list(folderPath)
    if (subError || !subFileList) {
      throw new Error(`Error getting recipes code for ${folderPath}`)
    }

    const subFiles = await Promise.all(
      subFileList.map(async (subFile) => {
        const { data: signedUrl, error: signError } = await storage
          .from('recipes')
          .createSignedUrl(`${folderPath}/${subFile.name}`, 60)
        if (signError || !signedUrl) {
          throw new Error(`Error creating signed URL for ${subFile.name}`)
        }
        return {
          path: `${folderName}/${subFile.name}`,
          downloadUrl: signedUrl.signedUrl,
        }
      }),
    )

    return subFiles.filter(
      (file): file is { path: string; downloadUrl: string } => file !== null,
    )
  }

  for (const item of fileList) {
    if (item.id === null) {
      const folderFiles = await processFolder(
        `${downloadPath}/${item.name}`,
        `${rootPath}/${item.name}`,
      )
      if (folderFiles.length > 0) {
        result[`${rootPath}/${item.name}`] = folderFiles
      }
    } else if (item.name.includes(fileName || '')) {
      const { data: signedUrl, error: signError } = await storage
        .from('recipes')
        .createSignedUrl(`${downloadPath}/${item.name}`, 60)
      if (signError || !signedUrl) {
        throw new Error(`Error creating signed URL for ${item.name}`)
      }
      result[rootPath] = result[rootPath] || []
      result[rootPath].push({ path: item.name, downloadUrl: signedUrl.signedUrl })
    }
  }
  return result
}

export const getRecipesBundleZip = async () => {
  const { data, error } = await storage.from('recipes').download('recipes-bundle.zip')
  if (error || !data) {
    console.error('Error downloading Recipes bundle:', error)
    throw new Error('Failed to download Recipes bundle')
  }
  return data
}

// =============================================================================
// Stripe-backed product/price/subscription orchestration — REMOVED.
//
// TODO(supabase-rip): the following functions used to upsert product+price+
// subscription rows from Stripe API objects into Supabase. Commerce now owns
// these primitives end-to-end. Anything still calling them should be ported to
// hit `commerce.subscriptions.*` directly or read from commerce's read APIs.
//
//   - upsertProductRecord / deleteProductRecord
//   - upsertPriceRecord   / deletePriceRecord
//   - getOrCreateRenewalPriceId
//   - populateStripeData
//   - createOrRetrieveCustomer
//   - manageSubscriptionStatusChange
//   - createTeamSubscription / createTeamInvoice
//   - deleteSubscriptionRecord
//   - addRenewalSubscription
//
// Existing import sites are now unresolved — the resulting TypeScript errors
// are intentional and act as a checklist. Each call site needs to be either
// (a) deleted because commerce handles it (most), or (b) replaced with a
// commerce REST call from the route handler.
// =============================================================================

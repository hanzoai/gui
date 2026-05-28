// @ts-check

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

/** @typedef {import('../features/supabase/types').Database} Database */

// Load .env.local file
dotenv.config({ path: '.env.local' })

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL}`)

/** @type {import('@supabase/supabase-js').SupabaseClient<Database>} */
const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

// Recipes price ID
const RECIPES_PRICE_ID = 'price_1OiqquFQGtHoG6xcZxZaVF2B'

async function insertRecipesProductOwnership(userEmail) {
  if (!userEmail) {
    throw new Error('userEmail is required')
  }

  try {
    // First, find the user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (userError || !user) {
      throw new Error(`User not found with email: ${userEmail}`)
    }

    console.info(`Found user: ${user.id} (${user.email})`)

    // Check if user already has this product ownership
    const { data: existingOwnership, error: ownershipError } = await supabaseAdmin
      .from('product_ownership')
      .select('*')
      .eq('user_id', user.id)
      .eq('price_id', RECIPES_PRICE_ID)

    if (ownershipError) {
      throw ownershipError
    }

    if (existingOwnership && existingOwnership.length > 0) {
      console.info(
        `User already has Recipes product ownership (ID: ${existingOwnership[0].id})`
      )
      return
    }

    // Insert new product ownership record
    const { data: newOwnership, error: insertError } = await supabaseAdmin
      .from('product_ownership')
      .insert({
        price_id: RECIPES_PRICE_ID,
        user_id: user.id,
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    console.info(`Successfully created Recipes product ownership for user: ${userEmail}`)
    console.info(`Product ownership ID: ${newOwnership.id}`)
    console.info(`Price ID: ${RECIPES_PRICE_ID}`)
    console.info(`User ID: ${user.id}`)
  } catch (error) {
    console.error('Error in insertRecipesProductOwnership:', error)
    throw error
  }
}

const userEmail = process.argv[2]
if (!userEmail) {
  console.error('Please provide a user email as an argument')
  console.error('Usage: node insert-recipes-product-ownership.mjs user@example.com')
  process.exit(1)
}

insertRecipesProductOwnership(userEmail).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})

-- This file creates a new product record for the "Gui Support" add-on.
-- Hanzo GUI Support offers prioritized development support at $1000 per tier per month.
INSERT INTO products (id, active, name, description, metadata)
VALUES (
  'prod_RlRebXO307MLoH',
  true,
  'Gui Support',
  'Receive prioritized development support: Each tier provides 2 hours of prioritized development per month at $800 per tier.',
  '{"plan": "support", "tier_hours": 2, "price_per_tier": 800}'
);
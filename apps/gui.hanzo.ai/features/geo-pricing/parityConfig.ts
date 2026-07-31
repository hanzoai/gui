/**
 * Purchasing Power Parity (PPP) pricing configuration
 *
 * Uses Cloudflare's CF-IPCountry header for geo detection.
 * Discounts stack with other promos (like beta discount).
 *
 * Strategy: explicitly list countries per tier, then default to a
 * generous discount for any unlisted country.
 *
 * Tiers:
 * - 0%:  US
 * - 10%: High income (UK, Canada, Australia, etc.)
 * - 25%: Upper-medium (Germany, France, Japan, etc.)
 * - 35%: Medium (Spain, Italy, Poland, China, etc.)
 * - 50%: Lower-medium (Brazil, Mexico, Turkey, etc.)
 * - 65%: Default for any unlisted country
 * - 75%: Low income (India, Vietnam, Pakistan, etc.)
 * - 85%: Very low income / economic crisis (Venezuela, Ethiopia, Haiti, etc.)
 */

export type ParityTier = {
  discount: number
  countries: string[] // ISO 3166-1 alpha-2 codes
}

// no discount
export const HIGH_INCOME_COUNTRIES = [
  'US', // United States
]

// high income
const TIER_1: ParityTier = {
  discount: 10,
  countries: [
    'GB', // United Kingdom
    'CA', // Canada
    'AU', // Australia
    'NZ', // New Zealand
    'CH', // Switzerland
    'NO', // Norway
    'DK', // Denmark
    'SE', // Sweden
    'IE', // Ireland
    'SG', // Singapore
    'HK', // Hong Kong
    'LU', // Luxembourg
    'IS', // Iceland
    'MC', // Monaco
    'LI', // Liechtenstein
    'BM', // Bermuda
  ],
}

// default discount for countries not in any tier or high-income list
export const DEFAULT_DISCOUNT = 65

// very low income / economic crisis
const TIER_6: ParityTier = {
  discount: 85,
  countries: [
    'VE', // Venezuela
    'ET', // Ethiopia
    'HT', // Haiti
    'SY', // Syria
    'YE', // Yemen
    'AF', // Afghanistan
    'SO', // Somalia
    'SS', // South Sudan
    'TZ', // Tanzania
    'UG', // Uganda
    'ZM', // Zambia
    'ZW', // Zimbabwe
    'SL', // Sierra Leone
    'LR', // Liberia
    'MG', // Madagascar
    'MW', // Malawi
    'MZ', // Mozambique
    'NE', // Niger
    'BI', // Burundi
    'CF', // Central African Republic
    'CD', // Democratic Republic of Congo
    'ER', // Eritrea
    'TD', // Chad
  ],
}

// low income
const TIER_5: ParityTier = {
  discount: 75,
  countries: [
    'IN', // India
    'VN', // Vietnam
    'PK', // Pakistan
    'BD', // Bangladesh
    'NG', // Nigeria
    'EG', // Egypt
    'PH', // Philippines
    'ID', // Indonesia
    'UA', // Ukraine
    'KE', // Kenya
    'GH', // Ghana
    'LK', // Sri Lanka
    'NP', // Nepal
    'KH', // Cambodia
    'MM', // Myanmar
    'LA', // Laos
    'BO', // Bolivia
    'UZ', // Uzbekistan
    'MN', // Mongolia
    'SN', // Senegal
    'RW', // Rwanda
    'CM', // Cameroon
    'CI', // Ivory Coast
    'BF', // Burkina Faso
    'TG', // Togo
    'BJ', // Benin
    'ML', // Mali
    'GN', // Guinea
  ],
}

// lower-medium income
const TIER_4: ParityTier = {
  discount: 50,
  countries: [
    'BR', // Brazil
    'MX', // Mexico
    'AR', // Argentina
    'TR', // Turkey
    'ZA', // South Africa
    'RU', // Russia
    'CO', // Colombia
    'PE', // Peru
    'EC', // Ecuador
    'TH', // Thailand
    'MY', // Malaysia
    'RO', // Romania
    'BG', // Bulgaria
    'RS', // Serbia
    'BA', // Bosnia and Herzegovina
    'MK', // North Macedonia
    'AL', // Albania
    'ME', // Montenegro
    'GE', // Georgia
    'AM', // Armenia
    'AZ', // Azerbaijan
    'KZ', // Kazakhstan
    'BY', // Belarus
    'MA', // Morocco
    'TN', // Tunisia
    'JO', // Jordan
    'DO', // Dominican Republic
    'JM', // Jamaica
    'IQ', // Iraq
    'LB', // Lebanon
    'TT', // Trinidad and Tobago
    'CW', // Curacao
    'AO', // Angola
    'GA', // Gabon
    'CG', // Congo
    'PG', // Papua New Guinea
    'DZ', // Algeria
    'LY', // Libya
  ],
}

// medium income
const TIER_3: ParityTier = {
  discount: 35,
  countries: [
    'ES', // Spain
    'IT', // Italy
    'PT', // Portugal
    'PL', // Poland
    'CZ', // Czech Republic
    'HU', // Hungary
    'EE', // Estonia
    'SI', // Slovenia
    'SK', // Slovakia
    'LT', // Lithuania
    'LV', // Latvia
    'HR', // Croatia
    'CY', // Cyprus
    'MT', // Malta
    'GR', // Greece
    'CL', // Chile
    'UY', // Uruguay
    'CR', // Costa Rica
    'PA', // Panama
    'PR', // Puerto Rico
    'CN', // China
    'OM', // Oman
  ],
}

// upper-medium income
const TIER_2: ParityTier = {
  discount: 25,
  countries: [
    'DE', // Germany
    'FR', // France
    'JP', // Japan
    'NL', // Netherlands
    'BE', // Belgium
    'AT', // Austria
    'FI', // Finland
    'IL', // Israel
    'KR', // South Korea
    'AE', // UAE
    'QA', // Qatar
    'KW', // Kuwait
    'BH', // Bahrain
    'TW', // Taiwan
    'SA', // Saudi Arabia
  ],
}

// all tiers for lookup (ordered highest discount first)
export const PARITY_TIERS = [TIER_6, TIER_5, TIER_4, TIER_3, TIER_2, TIER_1]

/**
 * Get the parity discount for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code (from CF-IPCountry header)
 * @returns discount percentage (0-100), or DEFAULT_DISCOUNT for unlisted countries
 */
export function getParityDiscount(countryCode: string | null): number {
  if (!countryCode) return 0

  const code = countryCode.toUpperCase()

  // high-income countries get no discount
  if (HIGH_INCOME_COUNTRIES.includes(code)) return 0

  // check explicit tiers
  for (const tier of PARITY_TIERS) {
    if (tier.countries.includes(code)) {
      return tier.discount
    }
  }

  // unlisted countries get a generous default
  return DEFAULT_DISCOUNT
}

/**
 * Get country name from code (for display)
 */
export const COUNTRY_NAMES: Record<string, string> = {
  // US (0%)
  US: 'United States',

  // tier 1 (15%)
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  NZ: 'New Zealand',
  CH: 'Switzerland',
  NO: 'Norway',
  DK: 'Denmark',
  SE: 'Sweden',
  IE: 'Ireland',
  SG: 'Singapore',
  HK: 'Hong Kong',
  LU: 'Luxembourg',
  IS: 'Iceland',
  MC: 'Monaco',
  LI: 'Liechtenstein',
  BM: 'Bermuda',

  // tier 2
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  FI: 'Finland',
  IL: 'Israel',
  KR: 'South Korea',
  AE: 'United Arab Emirates',
  QA: 'Qatar',
  KW: 'Kuwait',
  BH: 'Bahrain',
  TW: 'Taiwan',
  SA: 'Saudi Arabia',

  // tier 3
  ES: 'Spain',
  IT: 'Italy',
  PT: 'Portugal',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  EE: 'Estonia',
  SI: 'Slovenia',
  SK: 'Slovakia',
  LT: 'Lithuania',
  LV: 'Latvia',
  HR: 'Croatia',
  CY: 'Cyprus',
  MT: 'Malta',
  GR: 'Greece',
  CL: 'Chile',
  UY: 'Uruguay',
  CR: 'Costa Rica',
  PA: 'Panama',
  PR: 'Puerto Rico',
  CN: 'China',
  OM: 'Oman',

  // tier 4
  BR: 'Brazil',
  MX: 'Mexico',
  AR: 'Argentina',
  TR: 'Turkey',
  ZA: 'South Africa',
  RU: 'Russia',
  CO: 'Colombia',
  PE: 'Peru',
  EC: 'Ecuador',
  TH: 'Thailand',
  MY: 'Malaysia',
  RO: 'Romania',
  BG: 'Bulgaria',
  RS: 'Serbia',
  BA: 'Bosnia and Herzegovina',
  MK: 'North Macedonia',
  AL: 'Albania',
  ME: 'Montenegro',
  GE: 'Georgia',
  AM: 'Armenia',
  AZ: 'Azerbaijan',
  KZ: 'Kazakhstan',
  BY: 'Belarus',
  MA: 'Morocco',
  TN: 'Tunisia',
  JO: 'Jordan',
  DO: 'Dominican Republic',
  JM: 'Jamaica',
  IQ: 'Iraq',
  LB: 'Lebanon',
  TT: 'Trinidad and Tobago',
  CW: 'Curacao',
  AO: 'Angola',
  GA: 'Gabon',
  CG: 'Congo',
  PG: 'Papua New Guinea',
  DZ: 'Algeria',
  LY: 'Libya',

  // tier 5
  IN: 'India',
  VN: 'Vietnam',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  NG: 'Nigeria',
  EG: 'Egypt',
  PH: 'Philippines',
  ID: 'Indonesia',
  UA: 'Ukraine',
  KE: 'Kenya',
  GH: 'Ghana',
  LK: 'Sri Lanka',
  NP: 'Nepal',
  KH: 'Cambodia',
  MM: 'Myanmar',
  LA: 'Laos',
  BO: 'Bolivia',
  UZ: 'Uzbekistan',
  MN: 'Mongolia',
  SN: 'Senegal',
  RW: 'Rwanda',
  CM: 'Cameroon',
  CI: 'Ivory Coast',
  BF: 'Burkina Faso',
  TG: 'Togo',
  BJ: 'Benin',
  ML: 'Mali',
  GN: 'Guinea',

  // tier 6
  VE: 'Venezuela',
  ET: 'Ethiopia',
  HT: 'Haiti',
  SY: 'Syria',
  YE: 'Yemen',
  AF: 'Afghanistan',
  SO: 'Somalia',
  SS: 'South Sudan',
  TZ: 'Tanzania',
  UG: 'Uganda',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  SL: 'Sierra Leone',
  LR: 'Liberia',
  MG: 'Madagascar',
  MW: 'Malawi',
  MZ: 'Mozambique',
  NE: 'Niger',
  BI: 'Burundi',
  CF: 'Central African Republic',
  CD: 'Democratic Republic of Congo',
  ER: 'Eritrea',
  TD: 'Chad',
}

export function getCountryName(code: string | null): string {
  if (!code) return 'Unknown'
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase()
}

/**
 * Generate sample countries per tier for admin panel testing
 */
export function getParitySampleCountries(): Record<string, string[]> {
  const samples: Record<string, string[]> = {}
  for (const tier of PARITY_TIERS) {
    samples[`${tier.discount}% off`] = tier.countries.slice(0, 5)
  }
  // default catch-all — pick some countries not in any explicit tier
  samples[`${DEFAULT_DISCOUNT}% off (default)`] = ['FJ', 'BB', 'BW', 'MV', 'SC']
  samples['0% (no discount)'] = HIGH_INCOME_COUNTRIES.slice(0, 5)
  return samples
}

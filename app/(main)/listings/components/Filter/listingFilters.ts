import type { ListingType } from '@/store/useUiStore';

export interface ListingFilters {
  city: string;
  street: string;
  minPrice: string;
  maxPrice: string;
}

export const EMPTY_LISTING_FILTERS: ListingFilters = {
  city: '',
  street: '',
  minPrice: '',
  maxPrice: '',
};

export interface ActiveFilterChip {
  key: 'city' | 'street' | 'price';
  labelKey: 'filter_city' | 'filter_street' | 'filter_price';
  value: string;
  clear: Partial<ListingFilters>;
}

// Blank or non-numeric bounds are treated as unbounded.
function parseBound(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getPriceBounds(filters: ListingFilters) {
  return { min: parseBound(filters.minPrice), max: parseBound(filters.maxPrice) };
}

export function isPriceRangeInvalid(filters: ListingFilters): boolean {
  const { min, max } = getPriceBounds(filters);
  return min !== null && max !== null && min > max;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function getCityOptions(listings: ListingType[]): string[] {
  return uniqueSorted(listings.map((listing) => listing.city));
}

// Streets are limited to the selected city when one is chosen.
export function getStreetOptions(listings: ListingType[], city: string): string[] {
  return uniqueSorted(
    listings
      .filter((listing) => !city || listing.city === city)
      .map((listing) => listing.street),
  );
}

// Inclusive price range; an inverted range matches nothing and is reported by the UI.
export function filterListings(listings: ListingType[], filters: ListingFilters): ListingType[] {
  if (isPriceRangeInvalid(filters)) return [];

  const { min, max } = getPriceBounds(filters);

  return listings.filter((listing) => {
    if (filters.city && listing.city !== filters.city) return false;
    if (filters.street && listing.street !== filters.street) return false;
    if (min !== null && listing.price < min) return false;
    if (max !== null && listing.price > max) return false;
    return true;
  });
}

export function getActiveFilterChips(filters: ListingFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.city) {
    chips.push({ key: 'city', labelKey: 'filter_city', value: filters.city, clear: { city: '' } });
  }
  if (filters.street) {
    chips.push({ key: 'street', labelKey: 'filter_street', value: filters.street, clear: { street: '' } });
  }

  const priceParts: string[] = [];
  if (filters.minPrice.trim()) priceParts.push(`≥ ${filters.minPrice.trim()}`);
  if (filters.maxPrice.trim()) priceParts.push(`≤ ${filters.maxPrice.trim()}`);
  if (priceParts.length > 0) {
    chips.push({
      key: 'price',
      labelKey: 'filter_price',
      value: priceParts.join(' '),
      clear: { minPrice: '', maxPrice: '' },
    });
  }

  return chips;
}

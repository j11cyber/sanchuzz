"use client";

import { createContext, useContext } from "react";
import { BRANDS, type Brand, type BrandKey } from "@/lib/brands";

const BrandContext = createContext<Brand>(BRANDS.house);

/**
 * Wraps a brand's route-group layout so client components (nav, cart drawer,
 * add-to-bag) know which brand they are rendering inside.
 */
export function BrandProvider({ brand, children }: { brand: BrandKey; children: React.ReactNode }) {
  return <BrandContext.Provider value={BRANDS[brand]}>{children}</BrandContext.Provider>;
}

export function useBrand(): Brand {
  return useContext(BrandContext);
}

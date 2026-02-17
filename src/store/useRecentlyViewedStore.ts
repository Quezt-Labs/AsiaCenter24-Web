 import { create } from 'zustand';
 import { persist } from 'zustand/middleware';
 import { Product } from '@/types/product';
 
 interface RecentlyViewedState {
   products: Product[];
   addProduct: (product: Product) => void;
   clearAll: () => void;
 }
 
 const MAX_RECENTLY_VIEWED = 10;
 
 export const useRecentlyViewedStore = create<RecentlyViewedState>()(
   persist(
     (set, get) => ({
       products: [],
 
       addProduct: (product) => {
         set((state) => {
           // Remove if already exists
           const filtered = state.products.filter((p) => p.id !== product.id);
           // Add to beginning and limit to max
           const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
           return { products: updated };
         });
       },
 
       clearAll: () => {
         set({ products: [] });
       },
     }),
     {
       name: 'recently-viewed-storage',
     }
   )
 );
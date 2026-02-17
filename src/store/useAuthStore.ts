 import { create } from 'zustand';
 import { persist } from 'zustand/middleware';
 import { User } from '@/types/product';
 
 interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isAuthModalOpen: boolean;
   intendedRoute: string | null;
   
   // Actions
   setUser: (user: User) => void;
   logout: () => void;
   openAuthModal: (intendedRoute?: string) => void;
   closeAuthModal: () => void;
   clearIntendedRoute: () => void;
 }
 
 export const useAuthStore = create<AuthState>()(
   persist(
     (set) => ({
       user: null,
       isAuthenticated: false,
       isAuthModalOpen: false,
       intendedRoute: null,
 
       setUser: (user) => {
         set({ user, isAuthenticated: true });
       },
 
       logout: () => {
         set({ user: null, isAuthenticated: false });
         // Note: Cart is preserved on logout
       },
 
       openAuthModal: (intendedRoute) => {
         set({ isAuthModalOpen: true, intendedRoute: intendedRoute || null });
       },
 
       closeAuthModal: () => {
         set({ isAuthModalOpen: false });
       },
 
       clearIntendedRoute: () => {
         set({ intendedRoute: null });
       },
     }),
     {
       name: 'auth-storage',
       partialize: (state) => ({
         user: state.user,
         isAuthenticated: state.isAuthenticated,
       }),
     }
   )
 );
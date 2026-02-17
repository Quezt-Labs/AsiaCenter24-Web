 import { create } from 'zustand';
 import { persist } from 'zustand/middleware';
 import { Order, CartItem, Address } from '@/types/product';
 
 interface OrderState {
   orders: Order[];
   addOrder: (order: Order) => void;
   getOrder: (orderId: string) => Order | undefined;
   getOrders: () => Order[];
   clearOrders: () => void;
 }
 
 export const useOrderStore = create<OrderState>()(
   persist(
     (set, get) => ({
       orders: [],
 
       addOrder: (order) => {
         set((state) => ({
           orders: [order, ...state.orders],
         }));
       },
 
       getOrder: (orderId) => {
         return get().orders.find((o) => o.id === orderId);
       },
 
       getOrders: () => {
         return get().orders;
       },
 
       clearOrders: () => {
         set({ orders: [] });
       },
     }),
     {
       name: 'orders-storage',
     }
   )
 );
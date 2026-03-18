import { useQuery } from "@tanstack/react-query";
import { getDeliverySlots } from "@/api/deliverySlots";

export function useDeliverySlots() {
  return useQuery({
    queryKey: ["delivery-slots"],
    queryFn: getDeliverySlots,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

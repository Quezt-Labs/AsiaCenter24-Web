import api from "@/lib/api";

export interface DeliverySlot {
  id: string;
  date: string;
  timeSlot: string;
  available: boolean;
}

/**
 * Get delivery slots from API.
 * Returns empty array if endpoint is not available.
 */
export async function getDeliverySlots(): Promise<DeliverySlot[]> {
  try {
    const { data } = await api.get<DeliverySlot[] | { items: DeliverySlot[] }>(
      "/delivery-slots",
    );
    const list = Array.isArray(data)
      ? data
      : data && "items" in data && Array.isArray(data.items)
        ? data.items
        : [];
    return list;
  } catch {
    return [];
  }
}

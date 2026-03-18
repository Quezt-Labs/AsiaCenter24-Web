import api from "@/lib/api";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
  avatar: string;
}

/**
 * Get testimonials from API.
 * Returns empty array if endpoint is not available.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await api.get<Testimonial[] | { items: Testimonial[] }>(
      "/testimonials",
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

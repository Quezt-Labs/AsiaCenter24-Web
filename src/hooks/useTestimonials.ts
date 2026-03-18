import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/api/testimonials";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

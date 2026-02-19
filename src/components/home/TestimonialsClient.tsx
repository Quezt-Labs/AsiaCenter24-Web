"use client";
import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("./Testimonials"), {
  ssr: false,
  loading: () => <div className="h-24" />,
});

export default function TestimonialsClient() {
  return <Testimonials />;
}

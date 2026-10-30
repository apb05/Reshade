import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Transformation } from "@/components/home/Transformation";
import { ImpactHome } from "@/components/home/ImpactHome";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { Creativity } from "@/components/home/Creativity";
import { PartnerCTA } from "@/components/home/PartnerCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Transformation />
      <ImpactHome />
      <ProductShowcase />
      <Creativity />
      <PartnerCTA />
    </>
  );
}

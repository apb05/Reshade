import Image from "next/image";
import { asset } from "@/lib/asset";

/** The ReShade Colours logo, extracted from the official presentations. */
export function Logo({ tone = "dark", className = "h-12 w-auto" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Image
      src={tone === "dark" ? asset("/images/logo-reshade-dark.png") : asset("/images/logo-reshade-light.png")}
      alt="ReShade Colours"
      width={tone === "dark" ? 290 : 250}
      height={tone === "dark" ? 290 : 250}
      className={className}
      priority
    />
  );
}

export function EnactusLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return <Image src={asset("/images/logo-enactus-light.png")} alt="Enactus Humber Polytechnic" width={446} height={254} className={className} />;
}

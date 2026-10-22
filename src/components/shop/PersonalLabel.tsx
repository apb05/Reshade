"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";

export type LabelContent = { name: string; message?: string; size?: string | null };

/**
 * Personalised label printed onto the bottle preview. Typography scales with
 * the label's own width (container query units) so it looks identical on a
 * phone-sized thumbnail and the large studio preview.
 */
export function PersonalLabel({ name, message, size, hex }: LabelContent & { hex: string }) {
  const display = name.trim() || "Your colour";
  const long = display.length > 14;
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[2px] bg-[#f7f3ea] text-ink shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),inset_-10px_0_18px_-12px_rgba(0,0,0,0.35),inset_10px_0_14px_-12px_rgba(0,0,0,0.25)]"
      style={{ padding: "7cqw 8cqw 6cqw" }}
    >
      <div className="flex items-start justify-between">
        <Image src={asset("/images/logo-reshade-dark.png")} alt="" width={290} height={290} className="h-auto" style={{ width: "26cqw" }} />
        <span className="text-right font-sans font-semibold uppercase leading-tight text-ink-soft" style={{ fontSize: "4.6cqw", letterSpacing: "0.14em" }}>
          Recovered
          <br />
          pigment
        </span>
      </div>
      <div className="mt-auto">
        <div className="mb-[3cqw] h-[1.4cqw] w-[22cqw] rounded-full" style={{ background: hex }} />
        <p
          className="font-serif italic leading-[0.95] text-ink [overflow-wrap:anywhere]"
          style={{ fontSize: long ? "11.5cqw" : "15cqw" }}
        >
          {display}
        </p>
        {message ? (
          <p className="mt-[2.5cqw] line-clamp-2 font-sans leading-snug text-ink-soft" style={{ fontSize: "5.2cqw" }}>
            {message}
          </p>
        ) : null}
        <div className="mt-[4cqw] flex items-center justify-between border-t border-ink/15 pt-[2.5cqw] font-sans font-medium uppercase text-ink-soft" style={{ fontSize: "4.4cqw", letterSpacing: "0.12em" }}>
          <span>{hex}</span>
          <span>{size ?? "Made by you"}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCollection } from "@/store/collection";
import { STORY_CATEGORIES, useStudio, type Creation } from "@/store/studio";
import { useHydrated } from "@/components/layout/Providers";
import { checkAvailability } from "@/data/colour-availability";
import { PaintBottle } from "@/components/shop/PaintBottle";

const STATUS = {
  available: { label: "Available", cls: "bg-green-soft text-green" },
  request: { label: "Request needed", cls: "bg-yellow-soft text-navy" },
  unavailable: { label: "Unavailable", cls: "bg-red-soft text-red" },
};

export function MyCollection() {
  const hydrated = useHydrated();
  const items = useCollection((s) => s.items);

  if (!hydrated) return <div className="h-40" aria-hidden />;
  if (!items.length) {
    return (
      <div className="rounded-[2rem] border-2 border-dashed border-ink/15 px-6 py-14 text-center">
        <p className="font-serif text-3xl italic">Your collection is waiting for its first colour.</p>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">Create a shade in the studio and choose “Save to My Colour Collection”. Creations are saved on this device — no account needed.</p>
        <a href="#studio" className="mt-6 inline-block font-semibold text-navy underline decoration-yellow decoration-4 underline-offset-4">Create my first colour</a>
      </div>
    );
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false}>
        {items.map((c) => (
          <motion.li key={c.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
            <CreationCard c={c} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function CreationCard({ c }: { c: Creation }) {
  const { rename, duplicate, remove } = useCollection();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(c.name);
  const status = checkAvailability(c.hex).status;
  const category = STORY_CATEGORIES.find((s) => s.id === c.storyCategory);
  const created = new Date(c.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

  const edit = () => {
    useStudio.getState().loadCreation(c);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <article className="flex h-full gap-4 rounded-[1.75rem] bg-white p-4 shadow-[0_18px_50px_-32px_rgba(0,24,56,0.45)]">
      <div className="w-24 shrink-0 rounded-2xl p-2" style={{ background: `color-mix(in oklab, ${c.hex} 18%, #fbf8f2)` }}>
        <PaintBottle hex={c.hex} shadow={false} label={{ name: c.name, message: c.message }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              rename(c.id, draft);
              setEditing(false);
            }}
            className="flex gap-2"
          >
            <label className="sr-only" htmlFor={`rename-${c.id}`}>New name</label>
            <input id={`rename-${c.id}`} autoFocus value={draft} maxLength={28} onChange={(e) => setDraft(e.target.value)} className="field !rounded-xl !px-3 !py-1.5 font-serif text-lg italic" />
            <button type="submit" className="rounded-xl bg-navy px-3 text-sm font-semibold text-white">Save</button>
          </form>
        ) : (
          <h3 className="truncate font-serif text-2xl italic leading-tight">{c.name || "Untitled shade"}</h3>
        )}
        <p className="mt-1 flex items-center gap-2 font-mono text-xs text-ink-soft">
          <span aria-hidden className="size-3 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
          {c.hex}
        </p>
        {(category || c.story) && <p className="mt-2 line-clamp-2 text-sm italic text-ink-soft">{c.story ? `“${c.story}”` : category?.label}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-0.5 font-semibold ${STATUS[status].cls}`}>{STATUS[status].label}</span>
          <span className="text-ink-soft">Created {created}</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-sm font-semibold text-navy">
          <button type="button" onClick={edit} className="hover:underline">Edit<span className="sr-only"> {c.name}</span></button>
          <button type="button" onClick={() => { setDraft(c.name); setEditing((v) => !v); }} className="hover:underline">Rename</button>
          <button type="button" onClick={() => duplicate(c.id)} className="hover:underline">Duplicate</button>
          <button type="button" onClick={() => remove(c.id)} className="text-red hover:underline">Remove</button>
        </div>
      </div>
    </article>
  );
}

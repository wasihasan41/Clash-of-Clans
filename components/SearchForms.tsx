"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidTag, normalizeTag } from "@/lib/tag";

export function PlayerSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const tag = normalizeTag(value);
    if (!isValidTag(tag)) {
      setError("That does not look like a player tag. Example: #2PP");
      setValue("")
      return;
    }
    setError("");
    router.push(`/player/${tag}`);
  }

  return (
    <form className="panel search" onSubmit={onSubmit}>
      <h2 className="brand">Find a player stats</h2>
      <label htmlFor="player-tag">Player Tag </label>
      <div className="tag-input">
        <span className="tag-input-prefix" aria-hidden="true">
          #
        </span>
        <input
          id="player-tag"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="2PP"
          autoComplete="off"
        />
      </div>
      {error && <p className="field-error">{error}</p>}
      <button className="button" type="submit">
        Show player
      </button>
    </form>
  );
}

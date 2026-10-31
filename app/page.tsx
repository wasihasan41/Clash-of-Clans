import { PlayerSearch } from "@/components/SearchForms";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Check Player Stats</h1>
        <p>
          Search a player by tag to see their heroes, troops, equipment, pets, spells and recent
          battles.
        </p>
      </section>

      <div className="single">
        <PlayerSearch />
      </div>
    </>
  );
}

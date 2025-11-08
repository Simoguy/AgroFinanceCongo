import { useState } from "react";
import SearchBar from "../SearchBar";

export default function SearchBarExample() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un client..."
      />
      {search && (
        <p className="mt-2 text-sm text-muted-foreground">
          Recherche: {search}
        </p>
      )}
    </div>
  );
}

import { revalidateTag } from "next/cache";
import React from "react";

function ClearPage() {
  const clearCache = async () => {
    "use server";
    revalidateTag("pokemonList");
  };

  return (
    <div>
      <button onClick={clearCache}>Clear cache</button>
    </div>
  );
}

export default ClearPage;

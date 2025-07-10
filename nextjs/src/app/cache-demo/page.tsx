import { unstable_cache } from "@/helpers/asyncCache";
// import { unstable_cache as cache } from "next/cache";

interface Pokemon {
  name: string;
  url: string;
}

interface PokenInternalInterface {
  data: Pokemon[];
  uuid: string;
}

export const dynamic = "force-dynamic";

const getPokemonList = async (): Promise<PokenInternalInterface> => {
  console.log("Fetching data");
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  const data = await res.json();

  return {
    data: data.results,
    uuid: Math.random().toString(36).substring(7, 14),
  };
};

const getPokemonListCached = unstable_cache("pokemonList", getPokemonList, {
  maxSize: 10,
  revalidate: 5, // 5 seconds
});

async function MyPage() {
  const data = await getPokemonListCached();

  return (
    <div>
      <p>UUID: {data.uuid}</p>
      <ul>
        {data.data.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyPage;

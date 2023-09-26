"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/navigation";

const getPokemon = async (url: string) => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon" + url);
  const res = await response.json();
  return res;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickSearch, setClickSearch] = useState(false);
  const router = useRouter();
  const { data } = useSWR(clickSearch ? `/${searchTerm}` : null, getPokemon);

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="">
      <p className="mt-10 mb-5 text-blue-700 text-center">
        Pokemon&apos;s Form
      </p>
      <div className="mt-10 flex justify-center">
        <input
          placeholder="search here"
          className="border p-1"
          onChange={handleChange}
        />
        <button
          className="ml-3 border p-1"
          onClick={() => setClickSearch(true)}
        >
          search
        </button>
      </div>

      {data && (
        <div className="text-center">
          <img
            src={data?.sprites?.front_default}
            alt="poke-pic"
            className="w-[200px] m-auto"
          />
          <p className="text-lg bg-blue-300 ">Abilities</p>
          {data?.abilities?.map((res: any) => (
            <p
              key={res.ability.name}
              onClick={() => router.push(`/${res.ability.name}`)}
              className="text-blue-700 cursor-pointer"
            >
              {res.ability.name}
            </p>
          ))}

          <p className="text-lg bg-blue-300 mt-5">Forms</p>
          {data?.forms?.map((res: any) => (
            <p key={res.name}>{res.name}</p>
          ))}

          <p className="text-lg bg-blue-300 mt-5">Stats</p>
          <div className="grid grid-cols-4">
            {data?.stats?.map((res: any) => (
              <div key={res.stat.name} className="mb-5">
                <p>name: {res.stat.name}</p>
                <p>base stat: {res.base_stat}</p>
                <p>effort: {res.effort}</p>
              </div>
            ))}
          </div>

          <p className="text-lg bg-blue-300 mt-5">Types</p>
          {data?.types?.map((res: any) => (
            <p key={res.type.name}>{res.type.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}

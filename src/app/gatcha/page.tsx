"use client";

import useSWR from "swr";
import { useState, useMemo, useEffect } from "react";
import shuffle from "../utils";

const getLocation = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/location-area?limit=732"
  );
  const res = await response.json();
  return res;
};

const getLocationDetail = async (url: string) => {
  if (url.length > 1) {
    const response = await fetch(
      "https://pokeapi.co/api/v2/location-area" + url
    );
    const res = await response.json();
    return res;
  }
};

const getPokemonDetail = async (url: string) => {
  if (url.length > 1) {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon" + url);
    const res = await response.json();
    return res;
  }
};

export default function DetailAbility() {
  const [hideOptions, setHideOptions] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectLoc, setSelectLoc] = useState("");
  const [clickGatcha, setClickGatcha] = useState(false);
  const [randomGatcha, setRandomGatcha] = useState("");

  const { data } = useSWR(`/`, getLocation);
  const { data: dataDetail } = useSWR(`/${selectLoc}`, getLocationDetail);
  const { data: dataPokemon } = useSWR(
    clickGatcha && `/${randomGatcha}`,
    getPokemonDetail
  );

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (selectLoc && dataDetail) {
      setHideOptions(true);
      setSearchTerm("");
    }
  }, [dataDetail, selectLoc]);

  const filteredOptions = useMemo(() => {
    const selectOption = data?.results || [];

    if (selectOption) {
      return selectOption?.filter((item: any) => {
        return item["name"].toLowerCase().includes(searchTerm);
      });
    }
    return [];
  }, [data?.results, searchTerm]);

  const pokemonList = dataDetail?.pokemon_encounters?.map((data: any) => {
    const maxChance = data.version_details.map((data: any) => {
      return data.max_chance;
    });
    const findMaxChance = Math.max(...maxChance);

    return {
      name: data.pokemon.name,
      max_chance: findMaxChance,
    };
  });

  const randomArr = () => {
    let arr: any = [];

    // make array N length containing name of the pokemon with max_chance as N
    for (let i = 0; i < pokemonList?.length; i++) {
      const newArr: string[] = Array.from(
        Array(pokemonList[i].max_chance),
        () => pokemonList[i].name
      );

      // gather array in parent array
      arr.push(newArr);
    }

    // merge all nested array to the parent array
    const mergeArr = arr.flat(1);

    // shuffle array values
    shuffle(mergeArr);

    // randomly choose array value
    const randomElement = mergeArr[Math.floor(Math.random() * mergeArr.length)];
    setRandomGatcha(randomElement);
  };

  return (
    <div className="text-center mt-5">
      <p className="text-2xl mb-5"> Gatcha Pokemon</p>

      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={() => setHideOptions((prev) => !prev)}
          >
            {selectLoc || "Pick a location"}
            <svg
              className="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        {!hideOptions && (
          <div
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="p-1" role="none">
              <input className="border p-1 w-full" onChange={handleChange} />
              {(filteredOptions || []).map((loc: any, i: number) => (
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                  key={loc + i}
                  onClick={() => setSelectLoc(loc.name)}
                >
                  {loc.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        className="bg-yellow-400 block m-auto p-3 mt-5 text-blue-700"
        onClick={() => {
          randomArr();
          setClickGatcha(true);
        }}
      >
        Gatcha!
      </button>

      {clickGatcha && dataPokemon && (
        <div className="mx-10 mt-10">
          <p className="text-blue-700 bg-yellow-300 text-2xl p-2">
            Congratulations you got it!
          </p>

          <p className="text-4xl mt-5">{dataPokemon?.name}</p>

          <img
            src={dataPokemon?.sprites?.front_default}
            alt="poke-gatcha"
            className="m-auto w-[200px]"
          />
        </div>
      )}
    </div>
  );
}

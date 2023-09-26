"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";

const getPokemon = async (url: string) => {
  const response = await fetch("https://pokeapi.co/api/v2/ability" + url);
  const res = await response.json();
  return res;
};

export default function DetailAbility({ params }: { params: any }) {
  const router = useRouter();
  const { data } = useSWR(`/${params.detail}`, getPokemon);

  return (
    <div className="text-center mt-5">
      <p className="text-2xl mb-5"> {data?.name}&apos;s effect</p>
      <ul className="!text-left mx-10">
        {data?.effect_entries.map((res: any, i: number) => (
          <li key={"a" + i}>- {res.effect}</li>
        ))}
      </ul>
    </div>
  );
}

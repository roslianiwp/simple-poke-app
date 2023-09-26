import { useContext } from "react";
import Link from "next/link";

export default function Nav() {
  return (
    <div className="bg-blue-100 p-5" id="myTopnav">
      <Link href="/" className="mr-10">
        Home
      </Link>
      <Link href="/gatcha">Gatcha Pokemon</Link>
    </div>
  );
}

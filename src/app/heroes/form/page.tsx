import { Suspense } from "react";
import Loader from "@/app/Components/Loader";
import HeroFormClient from "./HeroFormClient";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <HeroFormClient />
    </Suspense>
  );
}

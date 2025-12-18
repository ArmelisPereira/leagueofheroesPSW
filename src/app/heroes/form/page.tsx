import { Suspense } from "react";
import HeroFormClient from "./HeroFormClient";

export default function Page() {
  return (
    <Suspense fallback={<div>A carregar…</div>}>
      <HeroFormClient />
    </Suspense>
  );
}

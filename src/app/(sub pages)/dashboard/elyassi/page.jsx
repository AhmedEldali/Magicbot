
"use client";
import dynamic from "next/dynamic";
const ElyassiDashboard = dynamic(() => import("@/pages/dashboard/elyassi"), {
  ssr: false,
});

export default function Page() {
  return <ElyassiDashboard />;
}

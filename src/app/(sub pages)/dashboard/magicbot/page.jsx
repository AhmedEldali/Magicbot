
"use client";
import dynamic from "next/dynamic";
const MagicBotDashboard = dynamic(() => import("@/pages/dashboard/magicbot"), {
  ssr: false,
});

export default function Page() {
  return <MagicBotDashboard />;
}

"use client";

import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import useInitCanvas from "@/hooks/useInitCanvas";

export default function Page() {
  const {} = useInitCanvas();

  return (
    <main className="h-screen w-full overflow-hidden">
      <Navbar />
      <section className="flex h-full">
        <LeftSidebar />
        <Live />
        <RightSidebar />
      </section>
    </main>
  );
}

// app/page.tsx
import GameBoard from "@/app/components/GameBoard";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <GameBoard />
    </main>
  );
}

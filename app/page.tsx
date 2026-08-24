import NexusScene from "./components/experience/NexusScene";
import HeroInterface from "./components/hero/HeroInterface";

export default function Home() {
  return (
    <main className="nexus-page">
      <NexusScene />
      <HeroInterface />
    </main>
  );
}
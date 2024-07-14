import cn from "../Utils/TailwindMerge";
import Background from "../components/Background";
import Title from "../components/Title";

export default function Home() {
  return (
    <main className={cn(
      'min-h-screen',
      'flex items-center justify-center',
      'overflow-hidden',
    )}>
      <Title />
    </main>
  );
}

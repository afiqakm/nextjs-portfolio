import SlidingTab from "@/src/components/SlidingTab";
import cn from "@/src/Utils/TailwindMerge";


export default function Playground() {
    return (
        <main className={cn(
            'flex item-center justify-center',
        )}>
            <SlidingTab />
        </main>
    );
}

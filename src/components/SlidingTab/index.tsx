import cn from "@/src/Utils/TailwindMerge";
import React from "react";

type Props = {};

const SlidingTab = (props: Props): React.ReactNode => {

    const renderTab = () => {
        return Array(10).fill(0).map((_, index) => {
            return (
                <div className={cn(
                    'w-full',
                    'h-[200px]',
                    'grid grid-cols-3',
                )}>
                    <div className={cn(
                        'm-2',
                        'border border-slate-800',
                        'rounded-tr-2xl rounded-bl-2xl',
                        'rounded-tl-sm rounded-br-sm',
                        'flex items-center justify-center',
                        // 'ring-8 ring-orange-800',
                    )}>
                        menu 1
                    </div>
                    <div className={cn(
                        'm-2',
                        'border border-slate-800',
                        'rounded-tr-2xl rounded-bl-2xl',
                        'rounded-tl-sm rounded-br-sm',
                        'flex items-center justify-center',
                    )}>
                        menu 2
                    </div>
                    <div className={cn(
                        'm-2',
                        'border border-slate-800',
                        'rounded-tr-2xl rounded-bl-2xl',
                        'rounded-tl-sm rounded-br-sm',
                        'flex items-center justify-center',
                    )}>
                        menu 3
                    </div>
                </div>
            )
        })
    }
    return (
        <div className={cn(
            'w-screen h-screen',
            'overflow-hidden',
            'relative',
        )}>
            <div className={cn(
                'h-screen w-[65vw]',
                'pr-[10vw]',
                'flex items-center justify-center',
            )}>
                container
            </div>
            <div className={cn(
                'absolute',
                'right-[10vw] top-0',
                'w-[30vw]',
                'h-screen',
                'bg-orange-200',
                'overflow-y-scroll',
                'no-scrollbar',
                'p-2',
                'skew-x-12',
            )}>
                {renderTab()}
            </div>
        </div>
    )
};

export default SlidingTab;

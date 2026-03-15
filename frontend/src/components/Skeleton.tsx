export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`rounded-lg border border-[#222] bg-[#141414] p-5 animate-pulse ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-md bg-[#222]" />
            </div>
            <div className="h-3.5 bg-[#222] rounded w-2/3 mb-2" />
            <div className="h-2.5 bg-[#1A1A1A] rounded w-1/3 mb-6" />
            <div className="border-t border-[#222] pt-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#222]" />
                <div className="w-5 h-5 rounded-full bg-[#1A1A1A]" />
                <div className="h-2 bg-[#1A1A1A] rounded w-8 ml-1" />
            </div>
        </div>
    );
}

export function SkeletonServiceCard() {
    return (
        <div className="border border-[#2C2C2C] bg-[#141414] rounded-lg p-5 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-[#222] w-7 h-7" />
                    <div className="h-3.5 bg-[#222] rounded w-24" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#222]" />
            </div>
            <div className="space-y-2 mt-6 p-3 bg-[#111] rounded border border-[#222]">
                <div className="flex justify-between">
                    <div className="h-2.5 bg-[#222] rounded w-10" />
                    <div className="h-2.5 bg-[#1A1A1A] rounded w-16" />
                </div>
                <div className="flex justify-between">
                    <div className="h-2.5 bg-[#222] rounded w-10" />
                    <div className="h-2.5 bg-[#1A1A1A] rounded w-20" />
                </div>
            </div>
        </div>
    );
}

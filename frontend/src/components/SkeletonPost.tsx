export default function SkeletonPost() {
    return (
        <div className="w-full max-w-xl mx-auto my-6 px-4 sm:px-6 py-6 rounded-2xl bg-black/25 animate-pulse border border-white/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div className="flex-1">
                    <div className="h-4 w-1/3 bg-white/20 mb-2 rounded" />
                    <div className="h-3 w-1/4 bg-white/10 rounded" />
                </div>
            </div>
            <div className="h-6 w-2/3 bg-white/20 mb-3 rounded" />
            <div className="w-full h-60 bg-white/10 mb-4 rounded" />
            <div className="h-4 w-full bg-white/10 rounded mb-2" />
            <div className="h-4 w-3/4 bg-white/10 rounded mb-4" />
            <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-white/10 rounded" />
                <div className="h-4 w-1/6 bg-white/10 rounded" />
            </div>
        </div>
    );
}
import ReviewCard from "./ReviewCard";


export default function Reviews() {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-custom-secondary overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full max-w-6xl">
                <h1 className="text-3xl font-semibold w-full px-5 py-10 md:text-5xl lg:text-7xl italic text-left">
                    Отзывы
                </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ReviewCard degree={10} className="rotate-12" />                
                <ReviewCard degree={10} className="-rotate-12" />
                <ReviewCard degree={10} className="-rotate-12" />
                <ReviewCard degree={10} className="rotate-12" />
                <ReviewCard degree={10} className="rotate-12" />
                <ReviewCard degree={10} className="-rotate-12" />
            </div>
        </div>
    )
}
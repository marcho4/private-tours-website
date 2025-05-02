"use client"

import { useQuery } from "@tanstack/react-query";
import TourCard from "./TourCard";
import { TourCardProps } from "./TourCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TourCardSkeleton = () => (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
        <Skeleton className="w-full h-64 rounded-t-lg" />
        <div className="p-5">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-6" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>
        </div>
    </div>
);

export default function Tours() {
    const { isPending, error, data } = useQuery({
        queryKey: ['tours'],
        queryFn: () =>
            fetch("http://localhost:8080/tours").then((res) =>
            res.json(),
        ),
    })

    const renderContent = () => {
        if (isPending) {
            return (
                <CarouselContent className="h-[72vh] items-stretch">
                    {[1, 2, 3].map((i) => (
                        <CarouselItem key={i} className="w-full flex items-center justify-center">
                            <TourCardSkeleton />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            );
        }

        if (error) {
            return (
                <div className="h-[72vh] flex flex-col items-center justify-center text-center p-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Ошибка при загрузке данных</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <Button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </Button>
                </div>
            );
        }

        return (
            <CarouselContent className="h-[72vh] items-stretch">                            
                {data.data.map((tour: TourCardProps) => (
                    <CarouselItem key={tour.id} className="w-full flex items-center justify-center">
                        <TourCard {...tour} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        );
    };

    return (
        <div id="tours" className="flex relative flex-col items-center justify-center w-full bg-zinc-100">

            <div className="flex flex-col items-center justify-center w-full max-w-6xl relative z-10">
                <div className="flex w-full max-w-6xl justify-end mb-6">
                    <h1 className="text-4xl font-semibold w-full px-5 pt-10 md:text-5xl lg:text-7xl font-playfair italic text-right">
                        Мои экскурсии
                    </h1>
                </div>
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    className="w-full"
                >
                    {renderContent()}
                    <div className="flex justify-center gap-4 mt-7 sm:mt-0">
                        <CarouselPrevious className="static translate-x-0 hover:bg-zinc-200 transition-colors" />
                        <CarouselNext className="static translate-x-0 hover:bg-zinc-200 transition-colors" />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}
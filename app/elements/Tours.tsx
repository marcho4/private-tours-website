"use client"

import TourCard from "./TourCard";
import { TourCardProps } from "./TourCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react";

const tours: TourCardProps[] = [
    {
        TourName: "Экскурсия по Москве",
        TourDescription: "Обзорная экскурсия по Москве, которая включает в себя все основные достопримечательности города. Также я вам расскажу много интересных фактов о столице и ее центре.",
        TourImage: "/moscow.jpg",
        TourPrice: 8000,
        TourDuration: 2,
        TourLocation: "Москва",
        TourRating: 4.5,
        TourMaxPeople: 10
    },
    {
        TourName: "Экскурсия по Центру",
        TourDescription: "Экскурсия по красной площади и Кремлю. Здесь вы увидите самые знаковые места Москвы и познакомитесь с ее историей. Также я вам рассксажу много интересных фактов о столице и ее центре.",
        TourImage: "/moscow2.jpg",
        TourPrice: 10000,
        TourDuration: 2,
        TourLocation: "Москва",
        TourRating: 5,
        TourMaxPeople: 7
    }
]

export default function Tours() {
    const [api, setApi] = useState<any>(null);
    useEffect(() => {
        if (!api) return;
    }, [api]);

    return (
        <div id="tours" className="flex relative flex-col items-center justify-center w-full bg-zinc-100">
            {/* <div className="absolute inset-0 -bottom-1 bg-[url('/map.svg')] bg-repeat bg-[length:200px_200px] w-full opacity-5" /> */}

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
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent className="h-[72vh] items-stretch">                            
                        {tours.map((tour) => (
                            <CarouselItem key={tour.TourName} className="w-full flex items-center justify-center">
                                <TourCard {...tour} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 mt-7 sm:mt-0">
                        <CarouselPrevious className="static translate-x-0 hover:bg-zinc-200 transition-colors" />
                        <CarouselNext className="static translate-x-0 hover:bg-zinc-200 transition-colors" />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}
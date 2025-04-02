import TourCard from "./TourCard";
import { TourCardProps } from "./TourCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"


const tours: TourCardProps[] = [
    {
        TourName: "Экскурсия по Москве",
        TourDescription: "Обзорная экскурсия по Москве, которая включает в себя все основные достопримечательности города.",
        TourImage: "/moscow.jpg",
        TourPrice: 8000,
        TourDuration: 2,
        TourLocation: "Москва",
        TourRating: 4.5,
        TourMaxPeople: 10
    },
    {
        TourName: "Экскурсия по Центру",
        TourDescription: "Экскурсия по Центру",
        TourImage: "/moscow2.jpg",
        TourPrice: 10000,
        TourDuration: 2,
        TourLocation: "Москва",
        TourRating: 5,
        TourMaxPeople: 7
    }
]


export default function Tours() {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-custom-secondary">
            <div className="flex flex-col items-center justify-center w-full max-w-6xl">
                <div className="flex w-full max-w-6xl justify-end">
                    <h1 className="text-4xl font-medium w-full px-5 py-10 md:text-5xl lg:text-7xl font-playfair italic text-right">
                        Авторские<br/>экскурсии
                    </h1>

                </div>
                <Carousel>
                    <CarouselContent>                            
                        {tours.map((tour) => (
                            <CarouselItem key={tour.TourName} className="w-full flex items-center justify-center">
                                <TourCard {...tour} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 mt-6">
                        <CarouselPrevious className="static translate-x-0" />
                        <CarouselNext className="static translate-x-0" />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}
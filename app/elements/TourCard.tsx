import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export interface TourCardProps {
    TourName: string, 
    TourDescription: string,
    TourImage: string, 
    TourPrice: number, 
    TourDuration: number, 
    TourLocation: string, 
    TourRating: number, 
    TourMaxPeople: number
}

export default function TourCard({
    TourName, 
    TourDescription, 
    TourImage, 
    TourPrice, 
    TourDuration, 
    TourLocation,
    TourRating,
    TourMaxPeople
}: TourCardProps) {
    return (
        <Card className="w-full border-none shadow-none max-w-[95vw] md:max-w-3xl mx-auto bg-custom-secondary">
            <CardHeader className="p-4">
                <CardTitle id="name" className="text-3xl lg:text-5xl text-center font-semibold">
                    {TourName}
                </CardTitle>
            </CardHeader>
            <CardContent id="main-content" className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
                <div id="image" className="w-full md:w-1/2 flex items-center justify-center">
                    <Image 
                        src={TourImage} 
                        alt={TourName} 
                        width={800} 
                        height={600} 
                        className="rounded-lg w-full h-[200px] md:h-[400px] object-cover"
                    />
                </div>
                <div id="description" className="w-full md:w-1/2 flex flex-col justify-between gap-4">
                    <div>
                    <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-medium">
                            Описание
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                            {TourDescription}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">
                                {TourPrice} ₽
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-amber-500">★</span>
                            <span>{TourRating}/5</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                                {TourDuration} часа
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                                До {TourMaxPeople} чел.
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-2">
                        <span className="text-sm text-gray-500">
                            Место: {TourLocation}
                        </span>
                    </div>
                    </div>
                    <Button variant={"default"} className="bg-custom-blue">Заказать</Button>
                    
                </div>
                
            </CardContent>
        </Card>
    )
}
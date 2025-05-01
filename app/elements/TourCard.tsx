"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import { z } from "zod";
import { Clock, MapPin, UserRound } from "lucide-react";
import * as React from "react";
import BookingDialog from "./BookingDialog";


const formSchema = z.object({
    tourName: z.string().min(2, { message: "Выбор тура обязателен" }).max(50, { message: "Название тура должно быть не более 50 символов" }),
    name: z.string().min(2, { message: "Имя обязательно" }).max(50, { message: "Имя должно быть не более 50 символов" }),
    surname: z.string().min(3, { message: "Фамилия обязательна" }).max(50, { message: "Фамилия должна быть не более 50 символов" }),
    email: z.string().email({ message: "Неверный формат email" }),
    phone: z.string().regex(/^\+7\d{10}$/, { message: "Телефон должен быть в формате +79990002299" }),
    date: z.date(),
    timeslot: z.string().min(2, { message: "Слот обязателен" }).max(50, { message: "Время должно быть не более 50 символов" }),
    numberOfPeople: z.number().min(1, { message: "Количество людей должно быть не менее 1" }).max(10, { message: "Количество людей должно быть не более 10" }),
    additionalInfo: z.string().min(0, { message: "Дополнительная информация должна быть не менее 0 символов" }).max(500, { message: "Дополнительная информация должна быть не более 500 символов" }),
});

type FormSchema = z.infer<typeof formSchema>;


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

    function onSubmit(values: FormSchema) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Card className="w-full shadow-lg max-w-[95vw] h-full md:h-fit max-h-[69vh] mb-8 mt-5 md:max-h-[65vh] md:max-w-3xl mx-auto gap-y-4">
            <CardHeader className="hidden md:block md:mb-4">
                <CardTitle id="name" className="text-3xl text-left font-semibold">
                    {TourName}
                </CardTitle>
            </CardHeader>
            <CardContent id="main-content" className="flex flex-col h-full
             md:items-stretch md:max-h-[50vh] md:flex-row 
             gap-x-4 sm:gap-x-6 sm:gap-y-6 pb-0 px-4 md:pb-6 md:px-6 mb-0">
                <div id="image" className="w-full md:w-1/2 md:h-full flex items-center justify-center ">
                    <Image 
                        src={TourImage} 
                        alt={TourName} 
                        width={800} 
                        height={600} 
                        className="rounded-lg mb-4 h-[150px] md:h-88 object-cover"
                    />
                </div>
                <CardTitle className="text-xl text-left mb-4 sm:mb-0 py-0 md:hidden">
                    <span className=" inline-flex items-center justify-between w-full gap-2">{TourName} 
                        <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="text-amber-500">★</span>
                                <span>{TourRating}/5</span>
                            </div>
                    </span>
                </CardTitle>
                <div id="description" className="sm:h-88 overflow-hidden w-full md:w-1/2 flex flex-col h-full flex-grow justify-between ">
                    <div className="flex flex-col flex-grow justify-between h-full mb-4">
                        <div className="space-y-2">
                            {/* <div className="text-lg font-medium hidden sm:block">
                                Описание
                            </div> */}
                            <p className="text-sm md:text-base text-gray-600">
                                {TourDescription}
                            </p>
                            <div className="flex justify-between">
                                <Button variant={"link"} size={"sm"} className="p-0 text-yellow-700">
                                    Подробнее
                                </Button>
                                <span className="font-medium md:hidden">
                                    {TourPrice} ₽
                                </span>
                            </div>
                        </div>

                        <div className="grid-cols-2 gap-4 mt-4 hidden md:grid">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">
                                    {TourPrice} ₽
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-amber-500">★</span>
                                <span>{TourRating}/5</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 inline-flex items-center gap-2">
                                    <Clock className="w-4 h-4"/> {TourDuration} часа
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 inline-flex items-center gap-2">
                                    <UserRound className="w-4 h-4"/> До {TourMaxPeople} чел.
                                </span>
                            </div>
                            <div className="mt-2 sm:block hidden">
                                <span className="text-sm text-gray-600 inline-flex items-center gap-2">
                                    <MapPin className="w-4 h-4"/> {TourLocation}
                                </span>
                            </div>
                        </div>
                    </div>  
                    <div className="hidden sm:block">
                        <BookingDialog onSubmit={onSubmit} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center w-full sm:hidden pt-0">
                <BookingDialog onSubmit={onSubmit} />
            </CardFooter>
        </Card>
    )
}
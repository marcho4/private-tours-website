"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";


const getTimeslotInfo = async (timeslotId: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeslot?id=${timeslotId}`)
        return res.json().then(data => data.data)
    } catch (error) {
        throw new Error("Failed to fetch timeslot info")
    }
}

const getExcursionInfo = async (excursionId: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/${excursionId}`)
        return res.json().then(data => data.data)
    } catch (error) {
        throw new Error("Failed to fetch excursion info")
    }
}


const getBooking = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`)
        let data = await res.json()
        
        const timeslotId = data.data.timeslot_id;
        const excursionId = data.data.excursion_id;

        return {
            ...data.data,
            timeslotInfo: await getTimeslotInfo(timeslotId),
            excursionInfo: await getExcursionInfo(excursionId),
        }
    } catch (error) {
        throw new Error("Failed to fetch booking")
    }
}

export default function BookingPage() {
    const { id } = useParams();

    const { data: booking, isLoading, isError } = useQuery({
        queryKey: ["booking", id],
        queryFn: () => getBooking(id as string),
    })

    if (isLoading) {
        return (
            <div className="flex flex-col container mx-auto">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-10" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Ошибка при загрузке бронирования</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col container mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Ваше бронирование</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        <h2>Количество человек</h2>
                        <p>{booking.persons}</p>

                        <h2>Дата и время</h2>
                        <p>{booking.timeslotInfo?.day}</p>
                        <p>{booking.timeslotInfo?.start_time}</p>

                        <h2>Экскурсия</h2>
                        <p>{booking.excursionInfo?.name}</p>
                        
                        <h2>Стоимость</h2>
                        <p>{booking.excursionInfo?.price}</p>
                        
                        <h2>Внесена ли предоплата?</h2>
                        <p>{booking.is_paid ? "Да" : "Нет"}</p>

                        <h2>Статус</h2>
                        <p>{booking.status}</p>

                        <h2>Отмена бронирования</h2>
                        <p>
                            <Button variant="destructive">
                                Отменить бронирование 
                            </Button>
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2>Оставить отзыв</h2>
                        <p>
                            <Button variant="outline">
                                Оставить отзыв
                            </Button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
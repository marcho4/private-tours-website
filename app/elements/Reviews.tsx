"use client"

import { useQuery } from "@tanstack/react-query";
import ReviewCard, { ReviewCardProps } from "./ReviewCard";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReviewCardSkeleton = ({className}: {className?: string}) => (
    <Card className={cn("aspect-square", className)}>
        <CardHeader>
            <CardTitle>
                <Skeleton className="h-6 w-24" />
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
        </CardContent>
    </Card>
)

export default function Reviews() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const { isPending, error, data } = useQuery({
        queryKey: ['reviews'],
        queryFn: () =>
            fetch("https://85.208.110.41/api/reviews").then((res) =>
            res.json()),
    })

    const renderReviews = () => {
        if (isPending) return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ReviewCardSkeleton key={i} className={i % 2 === 0 ? "rotate-12 z-30" : "-rotate-12 z-20"}/>
                ))}
            </div>
        );

        if (error) return (
            <div className="flex flex-col items-center justify-center text-center p-6 w-full">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Ошибка при загрузке отзывов</h2>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <Button 
                    onClick={() => window.location.reload()}
                >
                    Попробовать снова
                </Button>
            </div>
        );

        if (!data?.data || data.data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center w-full text-center text-2xl py-10">
                    У меня пока нет отзывов, сходите на тур и оставьте свой отзыв!
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                {data.data.map((review: ReviewCardProps, index: number) => (
                    <motion.div
                        key={review.id}
                        ref={ref}
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={index % 2 === 0 ? "rotate-12 z-30" : "-rotate-12 z-20"}
                    >
                        <ReviewCard {...review} degree={index % 3 === 0 ? 5 : index % 3 === 1 ? -5 : 0} />
                    </motion.div>
                ))}
            </div>
        );
    };

    
    return (
        <div id="reviews" className="flex flex-col items-center justify-center w-full bg-zinc-100 relative z-20 overflow-hidden pb-5 sm:pb-15">
            <div className="flex flex-col items-center justify-center w-full max-w-6xl">
                <h1 className="text-4xl font-semibold w-full px-5 py-10 md:text-5xl lg:text-7xl italic text-left">
                    Отзывы
                </h1>
            </div>
            {renderReviews()}
        </div> 
    )
}
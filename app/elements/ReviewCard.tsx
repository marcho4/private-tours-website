import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


export interface ReviewCardProps {
    id: string;
    written_by: string;
    review: string;
    rating: number;
    excursion_id: string;
}

export default function ReviewCard({degree, className} : {degree: number, className?: string}) {
    return <Card className={cn(`aspect-square rotate-[${degree}deg]`, className)}>
        <CardHeader>
            <CardTitle>
                <h1>
                    Review
                </h1>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
        </CardContent>
    </Card>
}
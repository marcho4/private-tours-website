import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import React from "react"

export default function Calen() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Select date
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />
            </PopoverContent>
        </Popover>
    )
}
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { date, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns/format";
import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import React, { useEffect } from "react";

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
})


export default function BookingDialog({onSubmit}: {onSubmit: (values: z.infer<typeof formSchema>) => void}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tourName: "",
            name: "",
            surname: "",
            email: "",
            phone: "",
            date: new Date(),
            timeslot: "",
            numberOfPeople: 1,
            additionalInfo: "",
        },
    })

    const selectedDate = form.watch("date");

    useEffect(() => {
        form.setValue("timeslot", "");
    }, [selectedDate]);

    const { data: toursData, isPending: isToursPending, error: toursError } = useQuery({
        queryKey: ['toursBooking'],
        queryFn: () => fetch('http://localhost:8080/tours')
            .then((res) => res.json())
            .then((json) => json.data),
    });

    function renderTours() {
        
        if (isToursPending) return <SelectItem value="loading">Загрузка...</SelectItem>
        if (toursError) return <SelectItem value="error">Не удалось загрузить туры</SelectItem>
        if (!Array.isArray(toursData)) return <SelectItem value="none">Нет туров</SelectItem>
        return toursData.map((tour: any) => (
            <SelectItem key={tour.id} value={tour.id} className="break-words hyphens-auto max-w-full">
                {tour.name}
            </SelectItem>
        ));
    }

    const { data: allTimeslotsData, isPending: isAllTimeslotsPending } = useQuery({
        queryKey: ['timeslots'],
        queryFn: () => fetch('http://localhost:8080/timeslots')
            .then((res) => res.json())
            .then((json) => {
                console.log("Ответ от /timeslots:", json);
                return json.data;
            }),
    });

    const availableDates = React.useMemo<Set<string>>(() => {
        if (!Array.isArray(allTimeslotsData)) {
            console.log("allTimeslotsData is not an array");
            return new Set();
        }
        const datesSet = new Set(
            allTimeslotsData
                .filter((slot: any) => slot.reserved === false)
                .map((slot: any) => slot.day)
        );

        return datesSet;
    }, [allTimeslotsData]);


    const { data: timeslotsData, isPending: isTimeslotsPending, error: timeslotsError } = useQuery({
        queryKey: ['timeslots', selectedDate],
        queryFn: () => fetch(
            `http://localhost:8080/timeslots?date=${formatDate(selectedDate, 'yyyy-MM-dd')}`
        ).then((res) => res.json()),
    });

    function renderTimeslots() {
       
    
        if (isTimeslotsPending) return <SelectItem value="loading">Загрузка...</SelectItem>
        if (timeslotsError) return <SelectItem value="error">Не удалось загрузить слоты</SelectItem>
        if (!Array.isArray(timeslotsData.data)) return <SelectItem value="none">Нет слотов</SelectItem>
        return timeslotsData.data.filter((timeslot: any) => timeslot.reserved === false).map((timeslot: any) => (
            <SelectItem key={timeslot.id} value={timeslot.id}>
                {timeslot.time_from.split(":").slice(0, 2).join(":")} - {timeslot.time_to.split(":").slice(0, 2).join(":")}
            </SelectItem>
        ));
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"default"} className="text-black w-full bg-gradient-to-br from-yellow-400 to-orange-400">Заказать</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-center text-gray-800 text-xl sm:text-2xl">Забронировать экскурсию</DialogTitle>
                </DialogHeader>
                <div className="">
                    <div className="flex flex-col items-center justify-start sm:py-2 overflow-y-auto
                                max-w-[90vw] sm:max-w-2xl sm:w-full px-3 max-h-[70vh] sm:max-h-[calc(90vh - 170px)] pb-2">
                        <Form {...form} >
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 w-full sm:max-w-2xl">
                                <div className="flex flex-col sm:flex-row w-full gap-x-4 gap-y-4 items-stretch justify-start">
                                    <div className="sm:w-1/2">
                                        <FormField control={form.control} name="tourName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Название тура
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full max-w-full min-h-[48px] whitespace-pre-line break-words py-2">
                                                            <SelectValue placeholder="Выберите тур" {...field} className="whitespace-pre-line break-words py-1" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-w-full">
                                                            <SelectGroup>
                                                                <SelectLabel>Туры</SelectLabel>
                                                                {renderTours()}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                    <div className="sm:w-1/2">
                                        <FormField control={form.control} name="numberOfPeople" render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>
                                                        Количество людей
                                                    </FormLabel>
                                                    <FormControl className="sm:min-h-[48px] h-full">
                                                        <Input
                                                            type="number"
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                field.onChange(value);
                                                            }}
                                                            value={field.value}
                                                            placeholder="Количество людей"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row w-full gap-x-4 gap-y-4">
                                    <div className="w-1/2">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Имя
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Имя" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <FormField control={form.control} name="surname" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Фамилия
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Фамилия" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full gap-x-4 gap-y-4">
                                    <div className="sm:w-1/2">
                                        <FormField control={form.control} name="date" render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel>Дата экскурсии</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !date && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon />
                                                            {field.value ? format(field.value, "PPP", { locale: ru }) : <span>Выберите дату</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        {isAllTimeslotsPending ? (
                                                            <div>Загрузка календаря...</div>
                                                        ) : (
                                                            <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                            }
                                                            modifiers={{
                                                                available: (date) => availableDates.has(formatDate(date, 'yyyy-MM-dd')) && date > new Date(),
                                                            }}
                                                            modifiersClassNames={{
                                                                available: "bg-green-100 text-black rounded-md",
                                                            }}
                                                            locale={ru}
                                                            />
                                                        )}
                                                        
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                    </div>
                                    <div className="sm:w-1/2">
                                        <FormField control={form.control} name="timeslot" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Время
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Выберите слот"  {...field}/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Слоты</SelectLabel>
                                                                {renderTimeslots()}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                </div>


                                <div className="flex flex-col sm:flex-row w-full gap-x-4 gap-y-4">
                                    <div className="sm:w-1/2">
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Телефон
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Телефон" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                    <div className="sm:w-1/2">
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    </div>
                                </div>



                                <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Дополнительная информация
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="max-h-20" placeholder="Дополнительная информация" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </form>
                        </Form>
                    </div>
                    <DialogFooter className="pb-5 max-w-[90vh] px-2 mt-2">
                        <Button type="button" className="text-black bg-gradient-to-br from-yellow-400 to-orange-400" onClick={form.handleSubmit(onSubmit)}>
                            Забронировать
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
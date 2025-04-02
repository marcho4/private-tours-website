"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { fi } from "date-fns/locale"
import Test from "./Test"
import * as React from "react"
import { ru } from "date-fns/locale/ru"
import { Card, CardContent } from "@/components/ui/card"



const formSchema = z.object({
    tourName: z.string().min(2, { message: "Название тура должно быть не менее 2 символов" }).max(50, { message: "Название тура должно быть не более 50 символов" }),
    name: z.string().min(2, { message: "Имя должно быть не менее 2 символов" }).max(50, { message: "Имя должно быть не более 50 символов" }),
    surname: z.string().min(2, { message: "Фамилия должна быть не менее 2 символов" }).max(50, { message: "Фамилия должна быть не более 50 символов" }),
    email: z.string().email({ message: "Неверный формат email" }),
    phone: z.string().min(10, { message: "Телефон должен быть не менее 10 символов" }).max(15, { message: "Телефон должен быть не более 15 символов" }),
    date: z.date(),
    timeslot: z.string().min(2, { message: "Время должно быть не менее 2 символов" }).max(50, { message: "Время должно быть не более 50 символов" }),
    numberOfPeople: z.number().min(1, { message: "Количество людей должно быть не менее 1" }).max(10, { message: "Количество людей должно быть не более 10" }),
    additionalInfo: z.string().min(0, { message: "Дополнительная информация должна быть не менее 0 символов" }).max(500, { message: "Дополнительная информация должна быть не более 500 символов" }),
})


export default function Booking() {
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

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }


    
    return (
        <div className="flex flex-col items-center justify-center w-full bg-custom-primary pb-10">
            <div className="flex flex-col items-center justify-center w-full max-w-6xl">
                <h1 className="text-4xl font-medium w-full px-5 py-10 md:text-5xl lg:text-7xl font-playfair italic text-right">
                    Забронировать
                </h1>
                <div className="flex flex-col items-center justify-center w-full px-3">
                    <Card>
                        <CardContent>
                            <Form {...form}>
                            <form 
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="space-y-4 w-full sm:w-96">
                                <FormField control={form.control} name="tourName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Название тура
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Выберите тур"  {...field}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                    <SelectLabel>Туры</SelectLabel>
                                                    <SelectItem value="moscow-tour">По Москве</SelectItem>
                                                    <SelectItem value="zamoskvorechie-tour">По Замоскворечью</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
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
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Дата экскурсии</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                            locale={ru}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )} />
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
                                                    <SelectItem value="moscow-tour">14:00 - 16:00</SelectItem>
                                                    <SelectItem value="zamoskvorechie-tour">16:00 - 18:00</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField control={form.control} name="numberOfPeople" render={({ field }) => {
                                    return (
                                    <FormItem>
                                        <FormLabel>
                                            Количество людей
                                        </FormLabel>
                                        <FormControl>
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
                                <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Дополнительная информация
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Дополнительная информация" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="flex flex-col items-center justify-center w-full">
                                    <Button type="submit">Забронировать</Button>
                                </div>
                            </form>
                        </Form>   
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    )
}


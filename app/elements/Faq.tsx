

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

  
export default function Faq() {
    return (
        <div className="container mx-auto max-w-5xl px-10 mt-10 mb-10 min-h-[80vh]">
            <h1 className="text-4xl font-semibold w-full px-5 pt-10 md:text-5xl lg:text-7xl italic text-right mb-10 sm:mb-20">
                Часто задаваемые вопросы
            </h1> 
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="sm:text-lg">Нужно ли вносить предоплату?</AccordionTrigger>
                    <AccordionContent>
                    Да, предоплата составляет 50% от стоимости тура для уверенности в том, что вы придете на экскурсию.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="sm:text-lg">Как можно оплатить экскурсию?</AccordionTrigger>
                    <AccordionContent>
                        Оплата производится наличными или переводом на карту. Предоплата только переводом
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="sm:text-lg">Что с собой взять на экскурсию?</AccordionTrigger>
                    <AccordionContent>
                        Для комфортной экскурсии желательно одеть удобную обувь и взять с собой воду и легкий перекус. В описании экскурсии указан необходимый инвентарь, если он нужен на экскурсии.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="sm:text-lg">Можно ли отменить бронь?</AccordionTrigger>
                    <AccordionContent>
                        Да, можно отменить бронь в любой момент за два дня до экскурсии. Если позже - предоплата не возвращается.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="sm:text-lg">Какие виды экскурсий вы можете предложить?</AccordionTrigger>
                    <AccordionContent>
                        Я предлагаю экскурсии по Москве на небольшую группу человек
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="sm:text-lg">Проводите ли вы экскурсии в плохую погоду?</AccordionTrigger>
                    <AccordionContent>
                        Да, провожу
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">  
                    <AccordionTrigger className="sm:text-lg">Можно ли предварительно пообщаться с экскурсоводом?</AccordionTrigger>
                    <AccordionContent>
                        Да, со мной можно связаться по номеру <a href="tel:+79161234567" className="text-blue-600 hover:underline">+7(916)123-45-67</a> или <a href="https://wa.me/79161234567" className="text-green-600 hover:underline">написать в WhatsApp</a>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

  )
}
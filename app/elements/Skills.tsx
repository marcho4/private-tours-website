"use client"

import React, { useState } from "react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile";

function MobileResponsiveHoverCard({ children, content, className = "" }: { children: React.ReactNode, content: React.ReactNode, className?: string }) {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    
    if (isMobile) {
        return (
            <div className={className}>
                <div 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="hover:cursor-pointer"
                >
                    {children}
                </div>
                {isOpen && (
                    <div className="bg-white rounded-md shadow-md p-4 mt-2 z-50 relative">
                        {content}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <HoverCard>
            <HoverCardTrigger className="hover:cursor-pointer">
                {children}
            </HoverCardTrigger>
            <HoverCardContent>
                {content}
            </HoverCardContent>
        </HoverCard>
    );
}


export default function Skills() {

    return (
        <div className="flex relative min-h-screen p-8 w-full bg-custom-olive">
            <div className="w-full max-w-6xl mx-auto ">
                <div className="absolute inset-0 bg-cover bg-[url('/texture2.jpg')] opacity-40 mix-blend-multiply"></div>

                <h1 className="text-3xl sm:px-5 pt-10 max-w-96 md:text-5xl lg:text-7xl italic text-left font-semibold">
                    Профессиональные навыки
                </h1>

                <div className="flex flex-col items-stretch md:flex-row">
                    <div className="grid grid-cols-2 md:w-2/3 relative">
                    <div>

                    </div>
                    <HoverCard openDelay={200} closeDelay={200}>
                        <HoverCardTrigger className="hover:cursor-pointer">
                            <div className="relative text-white font-medium transition-colors duration-300 hover:text-custom-blue text-2xl sm:text-3xl px-5 pt-15">
                                Высшее образование
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <p>
                                Я оконочила университет по специальность "История и культура"
                            </p>
                        </HoverCardContent>
                    </HoverCard>
                    

                    <HoverCard openDelay={200} closeDelay={200}>
                        <HoverCardTrigger className="hover:cursor-pointer">
                            <div className="relative  font-medium  text-right text-white transition-colors duration-300 hover:text-custom-blue text-2xl sm:text-3xl px-5 pt-15">
                                Лицензия экскурсовода
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <p>
                                Я получила лицензию экскурсовода в 2023 году
                            </p>
                        </HoverCardContent>
                    </HoverCard>
                    <div className="flex items-center justify-start pl-10">
                        <Image src="/Arrow 1.svg" className="" alt="skills" width={80} height={100} />  
                    </div>
                    <div className="flex items-center justify-end pr-10">
                    <Image src="/Arrow 2.svg" className="" alt="skills" width={80} height={100} />  

                    </div>
                    <HoverCard openDelay={200} closeDelay={200}>
                        <HoverCardTrigger className="hover:cursor-pointer">
                            <div className="relative font-medium  text-white transition-colors duration-300 hover:text-custom-blue text-2xl sm:text-3xl px-5 pt-10">
                                Трехлетний опыт работы
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <p>
                                Я работала экскурсоводом в течение 3 лет
                            </p>
                        </HoverCardContent>
                    </HoverCard>
                    
                    <HoverCard openDelay={200} closeDelay={200}>
                        <HoverCardTrigger className="hover:cursor-pointer">
                            <div className="relative text-right font-medium  text-white transition-colors duration-300 hover:text-custom-blue text-2xl sm:text-3xl px-5 pt-15">
                                Повышение квалификации
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <p>
                                Я прошла повышение квалификации в 2024 году
                            </p>
                        </HoverCardContent>
                    </HoverCard>
                    <div className="flex items-center pl-10">
                        <Image src="/Arrow 1.svg" className="" alt="skills" width={80} height={100} />  

                    </div>
                    </div>
                    <div className="mt-15 md:mt-0 md:w-1/3 flex items-center justify-center z-10">
                        <Image src="/group 7.svg" alt="skills" width={190} height={190} />
                    </div>
                </div>
                
            </div>
        </div>
    )
}
"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Skills() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
      });
    return (
        <div id="skills" className="flex relative min-h-screen p-8 w-full bg-zinc-100">

            <div className="w-full max-w-6xl mx-auto">
                {/* <div className="absolute inset-0 bg-cover bg-[url('/texture2.jpg')] opacity-40 mix-blend-multiply"></div> */}

                <h1 className="text-4xl break-words sm:break-normal hyphens-auto sm:hyphens-none font-semibold sm:px-5 pt-10 max-w-96 md:text-5xl lg:text-7xl italic text-left">
                    Профессиональные навыки
                </h1>

                <div className="flex flex-col items-stretch md:flex-row">
                    <div className="grid grid-cols-2 md:w-2/3 relative">
                    <div>

                    </div>
                    <div className="font-medium transition-colors duration-300 text-2xl sm:text-3xl px-5 pt-15">
                        Высшее образование
                        <p className="text-lg font-normal pt-2">
                            Я оконочила университет ОМГУ в 2002 году по специальности &#34;История и культура&#34;
                        </p>
                    </div>
                    

                    <div className="font-medium text-balance transition-colors duration-300 text-right text-2xl sm:text-3xl px-5 pt-15">
                        <div className="min-h-[4rem] break-words hyphens-auto">
                            Лицензия экскурсовода
                        </div>
                        <p className="text-lg font-normal text-right pt-2 break-words">
                            Я получила лицензию экскурсовода в 2023 году
                        </p>
                    </div>
                    
                    <div className="flex pt-10 justify-start sm:pl-10">
                        <svg 
                            width="68" 
                            height="40" 
                            viewBox="0 0 68 40" 
                            className="fill-yellow-400 hover:fill-custom-blue transition-colors duration-300 w-32 h-32"
                        >
                            <path d="M0.249797 32.3388C-0.115376 32.7531 -0.0755367 33.385 0.33879 33.7502L7.09058 39.7011C7.50491 40.0663 8.13682 40.0264 8.50199 39.6121C8.86717 39.1978 8.82733 38.5659 8.41301 38.2007L2.41141 32.911L7.7011 26.9094C8.06628 26.4951 8.02644 25.8632 7.61211 25.498C7.19779 25.1328 6.56588 25.1727 6.2007 25.587L0.249797 32.3388ZM66.0486 0.692175C63.4254 8.79999 55.1655 16.139 43.4097 21.7213C31.6958 27.2837 16.6982 31.0083 0.937078 32.002L1.06292 33.998C17.0382 32.9908 32.2906 29.2153 44.2676 23.528C56.2027 17.8605 65.0746 10.2 67.9514 1.30781L66.0486 0.692175Z"/>
                        </svg>
                    </div>
                    <div className="flex pt-10 justify-end sm:pr-10">
                        <svg 
                                width="71" 
                                height="37" 
                                viewBox="0 0 71 37" 
                                className="fill-yellow-400 hover:fill-custom-blue transition-colors duration-300 w-32 h-32"
                            >
                                <path d="M70.1951 27.9858C70.5877 28.3743 70.591 29.0074 70.2026 29.4L63.8724 35.7975C63.4839 36.1901 62.8508 36.1935 62.4582 35.805C62.0656 35.4166 62.0623 34.7834 62.4507 34.3908L68.0775 28.7041L62.3908 23.0773C61.9982 22.6888 61.9949 22.0557 62.3833 21.6631C62.7718 21.2705 63.4049 21.2672 63.7975 21.6556L70.1951 27.9858ZM2.50524 0.637024C5.61703 8.62547 14.3169 15.4493 26.4049 20.2633C38.4506 25.0604 53.6689 27.7804 69.4864 27.6967L69.497 29.6966C53.4631 29.7815 37.9844 27.0275 25.6649 22.1213C13.3877 17.232 4.0541 10.1233 0.641635 1.36297L2.50524 0.637024Z"/>
                        </svg>
                    </div>
                    <div className="font-medium hyphens-auto break-words transition-colors duration-300  text-2xl sm:text-3xl px-5 pt-15">
                        Трехлетний опыт работы
                        <p className="text-lg font-normal pt-2 hyphens-auto break-words">
                            Я работала экскурсоводом в течение 3 лет
                        </p>
                    </div>
                    
                    <div className="font-medium break-words hyphens-auto transition-colors duration-300 text-right text-2xl sm:text-3xl px-5 pt-15">
                        Повышение квалификации


                        <p className="text-lg font-normal text-right pt-2">
                            Я прошла повышение квалификации в 2024 году
                        </p>
                    </div>
                    
                    <div className="flex pt-10 justify-start sm:pl-10">
                        <svg 
                            width="68" 
                            height="40" 
                            viewBox="0 0 68 40" 
                            className="fill-yellow-400 hover:fill-custom-blue transition-colors duration-300 w-32 h-32"
                        >
                            <path d="M0.249797 32.3388C-0.115376 32.7531 -0.0755367 33.385 0.33879 33.7502L7.09058 39.7011C7.50491 40.0663 8.13682 40.0264 8.50199 39.6121C8.86717 39.1978 8.82733 38.5659 8.41301 38.2007L2.41141 32.911L7.7011 26.9094C8.06628 26.4951 8.02644 25.8632 7.61211 25.498C7.19779 25.1328 6.56588 25.1727 6.2007 25.587L0.249797 32.3388ZM66.0486 0.692175C63.4254 8.79999 55.1655 16.139 43.4097 21.7213C31.6958 27.2837 16.6982 31.0083 0.937078 32.002L1.06292 33.998C17.0382 32.9908 32.2906 29.2153 44.2676 23.528C56.2027 17.8605 65.0746 10.2 67.9514 1.30781L66.0486 0.692175Z"/>
                        </svg>
                    </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        ref={ref}

                        className="mt-15 md:mt-0 md:w-1/3 flex items-center justify-center z-10">
                        <div >
                            <Image src="/group 7.svg" alt="skills" width={190} height={190} />
                        </div>
                    </motion.div>
                    
                </div>
                
            </div>
        </div>
    )
}
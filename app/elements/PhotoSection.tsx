import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CalendarDays, UserSearch} from "lucide-react";
import Link from "next/dist/client/link";

export default function PhotoSection() {
  return (
    <div className="flex bg-zinc-100 h-screen relative mb-[-1px] w-full items-center justify-center">
        <div className="absolute inset-0 -bottom-1 bg-[url('/4-point-stars.svg')] bg-repeat-space bg-[length:50px_50px] w-full"/>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-zinc-100 via-zinc-100/50 to-transparent z-10"></div>

        {/* <div className="absolute top-40 left-3/7 z-0 -translate-x-1/2 blur-3xl overflow-hidden">
            <div className="aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-yellow-200 to-orange-500 opacity-30" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
        </div> */}

        <div className="flex flex-col sm:flex-row p-4 sm:p-6 w-full max-w-5xl gap-4 sm:gap-6 justify-center items-center sm:mt-16">
            <div className="flex z-10 flex-col items-center justify-center w-full sm:w-7/12">
                <div className="w-fit">
                    <div className="relative w-[280px] sm:w-[350px] md:w-[400px]">
                        <Image
                            src="/mama.jpg"
                            alt="Avatar"
                            width={500}
                            height={500}
                            className="rounded-lg sm:aspect-[3/4] object-cover border-2 border-black shadow-lg"
                            priority
                        />
                    </div>
                </div>
            </div>
            <div className="sm:w-5/12 flex flex-col justify-center">
                <div className="backdrop-blur-md py-6 sm:py-10 px-4 sm:px-5 rounded-3xl bg-white/30">
                    <div className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl mb-4 sm:mb-5 text-shadow-sm
                        font-semibold font-[family-name:var(--font-playfair-display)] italic text-center sm:text-left">
                        Наталья Дергилёва
                    </div>
                    <div className="text-base sm:text-xl text-center sm:text-left">
                        Ваш личный <strong>гид</strong> по Москве 
                    </div>
                    <div className="flex flex-col mt-4 mb-2 space-y-2.5 w-full">
                        <Link href="#skills" className="w-full">
                            <Button className="w-full text-black bg-gradient-to-br from-yellow-200 to-yellow-400  transition-colors duration-200">
                                Узнать обо мне <UserSearch className="ml-2 h-4 w-4 sm:h-5 sm:w-5"/>
                            </Button>
                        </Link>
                        <Link href="#tours" className="w-full">
                            <Button className="w-full text-black bg-gradient-to-br from-yellow-300 to-yellow-500 transition-colors duration-200">
                                Забронировать экскурсию <CalendarDays className="ml-2 h-4 w-4 sm:h-5 sm:w-5"/>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
import Image from "next/image";


export default function PhotoSection() {
  return (
    <div className="flex h-fit sm:min-h-screen relative mb-[-1px] w-full items-center justify-center">

        <div className="flex flex-col sm:flex-row p-6 w-full max-w-5xl gap-6 justify-start mt-16">
            <div className="absolute inset-0 -bottom-1 bg-cover bg-center bg-[url('/moscow-bg.jpg')] blur-s"></div>

            <div className="flex z-10 flex-col items-center justify-center w-full">
                <div className="w-fit">
                    <div className="relative sm:w-[400px]">
                        <Image 
                        src="/mama.jpg" 
                        alt="Avatar" 
                        width={600} 
                        height={600} 
                        className="rounded-lg sm:aspect-[3/4] object-cover border-2 border-black"
                        />
                    </div>
                </div>
            </div>
            <div className="sm:w-5/12 flex flex-col  justify-center"> 
                <div className="backdrop-blur-md py-10 px-5 rounded-3xl">
                   <div className="text-3xl md:text-4xl lg:text-6xl mb-5 font-semibold text-white font-[family-name:var(--font-playfair-display)] italic">
                        Наталья Дергилёва
                    </div>
                    <div className="sm:text-xl backdrop-blur-sm text-lg text-white">
                        Ваш личный <strong>гид</strong> по Москве с трёхлетним опытом работы
                    </div> 
                </div>
                
            </div>
    </div>
    </div>
    
  );
}
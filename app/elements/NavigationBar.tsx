"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";



export default function NavigationBar() {
  const mobile = useIsMobile();

  return (
    <div className="fixed top-0 sm:top-5 z-[40] bg-blend-color-burn flex-row w-full mx-auto max-w-5xl h-fit p-2 justify-between items-center mix-blend-exclusion hidden sm:flex">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
          Наталья Дергилёва
        </Link>
        {!mobile ? (
          <div className="flex flex-row gap-5">
            <Link href="#skills" className="hover:underline text-white font-semibold sm:text-lg">
              обо мне
            </Link>
            <Link href="#tours" className="hover:underline text-white font-semibold sm:text-lg">
              экскурсии
            </Link>
            <Link href="#reviews" className="hover:underline text-white font-semibold sm:text-lg">
              отзывы
            </Link>
          </div>
        ) : (
          <div className="flex flex-row gap-5">
            <Button variant="link" className="cursor-pointer font-normal text-white lab-grotesque">
              меню
            </Button>
          </div>
        )}
      </div>
  );
}
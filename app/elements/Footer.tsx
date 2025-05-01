import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-blue-950 w-full text-white min-h-[300px]">
            <div className="flex flex-row p-6 justify-between mx-auto w-full max-w-4xl">
                <div className="flex justify-start items-end px-6">
                    <Image src="/храм.svg" alt="logo" width={200} height={200} />
                </div>
                <div className="text-left">
                    connect@dernatalie.ru
                    <br />
                    (+7) 916 067 00 24
                    <br />
                    <br />
                    Малая Полянка
                    <br />
                    119180 Якиманка
                    <br />
                    Россия
                    <br />
                    <br />
                    <Link href="https://www.instagram.com/dernatalie/" className="hover:underline">
                        instagram
                    </Link>
                    <br />
                    <Link href="https://t.me/dernatalie" className="hover:underline">
                        telegram
                    </Link>
                    <br />
                    <br />
                    <span className="">настройки cookie @ 2025</span>
                </div>
            </div>
        </footer>
    )
}
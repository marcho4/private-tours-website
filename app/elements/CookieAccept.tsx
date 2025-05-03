import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieAccept() {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Проверяем, принял ли пользователь куки ранее
        const cookiesAccepted = localStorage.getItem("cookiesAccepted1");
        if (!cookiesAccepted) {
            setIsVisible(true);
        }
    }, []);
    
    const handleAccept = () => {
        // Сохраняем согласие в localStorage
        localStorage.setItem("cookiesAccepted1", "true");
        setIsVisible(false);
    };
    
    
    if (!isVisible) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-50 fixed flex flex-row justify-between items-center bottom-0 w-full px-4 py-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
        >
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Наш сайт использует куки. 
                Продолжая им пользоваться, вы соглашаетесь на обработку персональных данных
                в соответствии с <Link href="/policy" className="text-orange-400 dark:text-orange-400 hover:underline">политикой конфиденциальности</Link>.
            </p>
            <div className="flex flex-wrap gap-2 items-end justify-end p-2">
                <Button
                    size={"sm"}
                    onClick={handleAccept}
                    className="text-black w-24 bg-gradient-to-br from-yellow-300 to-orange-400 hover:from-yellow-400  hover:to-orange-500 transition-colors duration-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Принять
                </Button>
            </div>
        </motion.div>
    );
}
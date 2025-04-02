import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display  } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import NavigationBar from "./elements/NavigationBar";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});


const labGrotesque = localFont({
  src: [
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Black.woff2", weight: "900", style: "normal" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-BlackItalic.woff2", weight: "900", style: "italic" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Bold.woff2", weight: "700", style: "normal" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-BoldItalic.woff2", weight: "bold", style: "italic" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Italic.woff2", weight: "normal", style: "italic" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Light.woff2", weight: "300", style: "normal" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-LightItalic.woff2", weight: "300", style: "italic" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Medium.woff2", weight: "500", style: "normal" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-MediumItalic.woff2", weight: "500", style: "italic" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Regular.woff2", weight: "400", style: "normal" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-Thin.woff2", weight: "100", style: "normal" },
      { path: "../public/fonts/lab_grotesque/LabGrotesque-ThinItalic.woff2", weight: "100", style: "italic" },
  ],
  variable: "--font-lab-grotesque",
});


export const metadata: Metadata = {
  title: "Наталья Дергилёва",
  description: "Гид по Москве",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      
      <body className={`scroll-smooth ${playfairDisplay.variable} ${labGrotesque.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

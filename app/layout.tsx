import type { Metadata } from "next";
import { Crimson_Pro, Lora, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import Navigation from "./components/Navigation";

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  
   
})

const lora = Lora({
  variable: "--font-lora",
  style: "italic"
   
})

const roboto = Roboto({
  variable: "--font-roboto",
 
   
})


export const metadata: Metadata = {
  title: "FoodManiak",
  description: "Generator diet AI, tworzenie jadłospisów online, sprawdzanie swojego BMI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${crimson.variable} ${lora.variable} ${roboto.variable} h-full  antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

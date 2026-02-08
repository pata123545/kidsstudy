// src/app/layout.js
import { Rubik } from 'next/font/google'; // Rubik is better for Hebrew
import "./globals.css";

const rubik = Rubik({
    subsets: ['hebrew', 'latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-rubik',
});

export const metadata = {
    title: "מערת הלמידה הקסומה",
    description: "המקום בו למידה הופכת להרפתקה!",
};

export default function RootLayout({ children }) {
    return (
        <html lang="he" dir="rtl" className={`${rubik.variable}`}>
            <body className="antialiased bg-background text-foreground min-h-screen overflow-x-hidden font-rubik" suppressHydrationWarning={true}>
                {children}
            </body>
        </html>
    );
}
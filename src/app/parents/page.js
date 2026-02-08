import Link from 'next/link';
import { ArrowLeft, LineChart } from 'lucide-react';

export default function Parents() {
    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-8" dir="rtl">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8">
                <ArrowLeft className="w-5 h-5" /> חזרה לדף הבית
            </Link>

            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <LineChart className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold">לוח בקרה להורים</h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-2">זמן למידה שבועי</h3>
                        <div className="text-4xl font-black text-blue-600">3.5 שעות</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-2">מיומנויות שנרכשו</h3>
                        <div className="text-4xl font-black text-green-600">12</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-2">הנושא הבא</h3>
                        <div className="text-xl font-bold text-slate-700">חיבור עד 10</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

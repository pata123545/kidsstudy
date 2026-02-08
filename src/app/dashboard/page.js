import { checkSubscriptionStatus } from '@/lib/checkSubscription';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Lock, CreditCard, Clock, Star, Brain, Activity, User, Settings, LogOut } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import ChildProfile from '@/components/dashboard/ChildProfile';

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not authenticated
        return (
            <div className="min-h-screen bg-[#0d1424] flex items-center justify-center text-white">
                <p>Please <Link href="/login" className="text-cave-glow underline">Login</Link> to access the dashboard.</p>
            </div>
        );
    }

    // Unsecure check: We'll fetch the profile to get the child's name
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    const { allowed, reason, trialEndsAt } = await checkSubscriptionStatus(user.id, supabase);

    if (!allowed) {
        // Access Denied / Trial Expired View
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-center" dir="rtl">
                <div className="bg-[#1a1a2e] max-w-lg w-full p-8 rounded-3xl border border-red-500/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2">תקופת הניסיון הסתיימה</h2>
                        <p className="text-gray-400 mb-8">
                            מקווים שנהניתם! כדי להמשיך את המסע ולשמור על ההתקדמות, אנא הסדירו את התשלום.
                        </p>

                        <div className="space-y-4">
                            <Link
                                href="/api/checkout?plan=pro"
                                className="block w-full bg-gradient-to-r from-cave-glow to-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                רכוש מנוי מלא - 49₪
                            </Link>

                            <Link
                                href="/api/checkout?plan=basic"
                                className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-colors"
                            >
                                תוכנית בסיסית - 29₪
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-gray-500">
                            ניתן לבטל בכל עת. תשלום מאובטח באמצעות Stripe.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Mock Data for Dashboard (Replace with real DB calls later)
    const skills = [
        { name: 'פתרון בעיות (לוגיקה)', level: 85, color: 'blue' },
        { name: 'זיכרון חזותי', level: 60, color: 'purple' },
        { name: 'זיהוי צורות', level: 90, color: 'green' },
    ];

    // Access Granted View
    return (
        <div className="min-h-screen bg-[#0d1424] text-white font-rubik" dir="rtl">

            {/* Top Navigation Bar */}
            <nav className="border-b border-white/5 bg-[#1a1a2e]/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xl font-bold text-white">
                        <span className="bg-gradient-to-r from-cave-glow to-primary bg-clip-text text-transparent">KidsStudy Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-sm border border-yellow-500/20">
                            <Star className="w-4 h-4 fill-current" />
                            <span>מנוי {reason === 'trial' ? 'ניסיון' : 'PRO'}</span>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Settings className="w-5 h-5 text-gray-400" /></button>
                        <form action="/auth/signout" method="post">
                            <button className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-gray-400" title="התנתק">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">שלום, {profile?.parent_name || 'הורה יקר'}! 👋</h1>
                        <p className="text-gray-400">הנה סקירה של ההתקדמות של {profile?.child_name || 'הילד שלך'} השבוע.</p>
                    </div>
                    <Link
                        href="/cave"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <Brain className="w-5 h-5" />
                        כניסה למערת הלמידה
                    </Link>
                </header>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Column (Stats & Charts) - Spans 8 cols */}
                    <div className="md:col-span-8 space-y-6">
                        {/* Stat Cards Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard
                                title="זמן משחק"
                                value="3.5 שעות"
                                icon={<Clock />}
                                color="blue"
                                trend={{ value: '+15%', positive: true }}
                            />
                            <StatCard
                                title="משחקים הושלמו"
                                value="12"
                                icon={<Activity />}
                                color="purple"
                                trend={{ value: '+4', positive: true }}
                            />
                            <StatCard
                                title="כוכבים שנאספו"
                                value="450"
                                icon={<Star />}
                                color="yellow"
                            />
                        </div>

                        {/* Subscription Alert (if trial) */}
                        {reason === 'trial' && (
                            <div className="bg-gradient-to-l from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-6 rounded-2xl flex items-center justify-between">
                                <div>
                                    <h3 className="text-yellow-200 font-bold mb-1">תקופת הניסיון מסתיימת בקרוב!</h3>
                                    <p className="text-yellow-400/70 text-sm">נותרו עוד {Math.ceil((new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))} ימים לניסיון החינם.</p>
                                </div>
                                <Link
                                    href="/api/checkout?plan=pro"
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
                                >
                                    שדרג עכשיו
                                </Link>
                            </div>
                        )}

                        {/* Main Chart */}
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 h-80 flex flex-col justify-center items-center text-gray-500 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                            <Activity className="w-16 h-16 mb-4 opacity-20" />
                            <p>גרף פעילות שבועי יוצג כאן</p>
                            <span className="text-xs opacity-50">(בקרוב)</span>
                        </div>
                    </div>

                    {/* Right Column (Profile & Skills) - Spans 4 cols */}
                    <div className="md:col-span-4 space-y-6">
                        <ChildProfile
                            name={profile?.child_name || 'ילד'}
                            age={profile?.child_age || '5'}
                            avatar={null} // Placeholder for avatar
                        />

                        <ProgressChart skills={skills} />

                        {/* Recent Activity Feed */}
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-white mb-4 text-sm">פעילות אחרונה</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Brain className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">השלים את "החיפושית"</p>
                                        <p className="text-xs text-gray-500">לפני 2 דקות</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">השיג שיא חדש!</p>
                                        <p className="text-xs text-gray-500">לפני שעה</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

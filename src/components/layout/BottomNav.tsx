import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Smartphone,
    CreditCard,
    PlusCircle,
    Menu,
    Filter // Using Filter icon for Manage as a placeholder or Files
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { QrCode, Lock, Settings, LogOut } from 'lucide-react';

export const BottomNav = () => {
    const mainNav = [
        { to: '/', icon: LayoutDashboard, label: 'Home' },
        { to: '/manage', icon: Filter, label: 'Manage' },
        { to: '/new-registration', icon: PlusCircle, label: 'Register' },
    ];

    const moreNav = [
        { to: '/lock-control', icon: Lock, label: 'Lock Control' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pb-safe pointer-events-none">
            <nav className="glass-card w-full max-w-lg rounded-2xl flex justify-around items-center h-16 px-2 shadow-2xl border-primary/20 pointer-events-auto">
                {mainNav.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `relative flex flex-col items-center justify-center w-full h-full space-y-1 rounded-xl transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? '-translate-y-1' : ''}`} />
                                <span className={`text-[10px] font-medium transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
                                {isActive && (
                                    <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full animate-bounce" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                <Sheet>
                    <SheetTrigger className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary rounded-xl transition-all">
                        <Menu className="w-5 h-5" />
                        <span className="text-[10px] font-medium opacity-70">More</span>
                    </SheetTrigger>
                    {/* Sheet content remains same */}
                    <SheetContent side="bottom" className="h-[50vh] rounded-t-[2rem] border-t-0 p-6 glass-card">
                        <SheetHeader className="text-left mb-6">
                            <SheetTitle className="text-lg">Menu</SheetTitle>
                        </SheetHeader>
                        <div className="grid grid-cols-4 gap-4">
                            {moreNav.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20"
                                >
                                    <div className="p-3.5 rounded-full bg-background/50 border border-primary/10 text-foreground group-hover:text-primary transition-colors shadow-sm">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-medium text-center">{item.label}</span>
                                </NavLink>
                            ))}
                            <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-destructive/5 hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20">
                                <div className="p-3.5 rounded-full bg-background/50 border border-destructive/10 text-destructive shadow-sm">
                                    <LogOut className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-center text-destructive">Logout</span>
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
};

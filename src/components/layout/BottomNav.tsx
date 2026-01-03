import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    Filter,
    Lock,
    Settings
} from 'lucide-react';

export const BottomNav = () => {
    const mainNav = [
        { to: '/', icon: LayoutDashboard, label: 'Home' },
        { to: '/manage', icon: Filter, label: 'Manage' },
        { to: '/new-registration', icon: PlusCircle, label: 'Register' },
        { to: '/lock-control', icon: Lock, label: 'Lock' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pb-safe pointer-events-none">
            <nav className="glass-card w-full max-w-2xl rounded-2xl flex justify-around items-center h-16 px-2 shadow-2xl border-primary/20 pointer-events-auto">
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
            </nav>
        </div>
    );
};

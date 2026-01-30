'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map, Radio, Users, LogOut, Menu, User, Settings } from 'lucide-react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ClientOnly } from '@/components/ClientOnly';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = Cookies.get('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/map', label: 'Tactical Map', icon: Map },
        { href: '/dashboard/feed', label: 'Live Field Feed', icon: Radio },
        // { href: '/dashboard/volunteers', label: 'Agents', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">K</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Kiongozi</h1>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 font-mono">ELECTION MONITOR v1.0</p>
                </div>

                <ScrollArea className="flex-1 px-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                                        : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator className="my-4" />

                    <div className="px-3">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Systems</h3>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-600">
                            <Settings size={18} className="mr-2" />
                            Settings
                        </Button>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <ClientOnly>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start px-2 hover:bg-neutral-100">
                                    <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage src="" />
                                        <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left flex-1 truncate">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ClientOnly>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="md:hidden mr-4">
                            <Menu size={24} />
                        </Button>
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                            {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-mono text-neutral-500">SYSTEM ONLINE</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <ScrollArea className="flex-1 p-6 bg-neutral-50/50 dark:bg-neutral-900/50">
                    {children}
                </ScrollArea>
            </main>
        </div>
    );
}

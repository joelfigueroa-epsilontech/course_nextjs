'use client';

import { LogoutButton } from '@/components/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { FileText, Home, MessageSquare, PenTool, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Blogs',
    href: '/dashboard/blogs',
    icon: FileText,
  },
  {
    title: 'AI Chat',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const bottomNavItem = {
  title: 'Account',
  href: '/dashboard/account',
  icon: User,
};

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 bg-muted/40 border-r">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
          <PenTool className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">Course App</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/chat' && pathname.startsWith('/chat'));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('w-full justify-start gap-3 h-10', isActive && 'bg-secondary text-secondary-foreground')}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t">
        <Link href={bottomNavItem.href}>
          <Button
            variant={pathname === bottomNavItem.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 h-10 mb-3',
              pathname === bottomNavItem.href && 'bg-secondary text-secondary-foreground'
            )}
          >
            <bottomNavItem.icon className="w-4 h-4" />
            {bottomNavItem.title}
          </Button>
        </Link>

        <Separator className="mb-3" />

        <div className="flex items-center gap-3 p-2 rounded-md bg-background/50">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
        </div>

        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { BarChart3, FileText, Home, Menu, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogoutButton } from './logout-button';
import { Separator } from './ui/separator';

const navigationItems = [
  {
    title: 'Home',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

const bottomNavItem = {
  title: 'Settings',
  href: '/admin/settings',
  icon: Settings,
};

export function AdminMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-destructive rounded-md">
            <Settings className="w-4 h-4 text-destructive-foreground" />
          </div>
          <span className="font-semibold text-lg">Admin Panel</span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="flex flex-row items-center gap-2 p-6 border-b space-y-0">
                <div className="flex items-center justify-center w-8 h-8 bg-destructive rounded-md">
                  <Settings className="w-4 h-4 text-destructive-foreground" />
                </div>
                <SheetTitle className="font-semibold text-lg">Admin Panel</SheetTitle>
              </SheetHeader>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setOpen(false)}>
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
                <Link href={bottomNavItem.href} onClick={() => setOpen(false)}>
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
                    <AvatarFallback className="text-xs bg-destructive text-destructive-foreground">A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Admin</p>
                    <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
                  </div>
                </div>

                <div className="mt-3">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

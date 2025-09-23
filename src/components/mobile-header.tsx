'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { FileText, Home, Menu, PenTool, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogoutButton } from './logout-button';
import { Separator } from './ui/separator';

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

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <PenTool className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Course App</span>
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
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                  <PenTool className="w-4 h-4 text-primary-foreground" />
                </div>
                <SheetTitle className="font-semibold text-lg">Course App</SheetTitle>
              </SheetHeader>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

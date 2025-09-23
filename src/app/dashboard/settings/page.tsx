import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bell, Database, Globe, Palette, Shield, Zap } from 'lucide-react';

const settingsCategories = [
  {
    title: 'Notifications',
    description: 'Configure how you receive notifications',
    icon: Bell,
    items: ['Email notifications', 'Push notifications', 'Marketing emails'],
  },
  {
    title: 'Privacy & Security',
    description: 'Manage your privacy and security settings',
    icon: Shield,
    items: ['Two-factor authentication', 'Login history', 'Data export'],
  },
  {
    title: 'Appearance',
    description: 'Customize the look and feel',
    icon: Palette,
    items: ['Theme preference', 'Color scheme', 'Font size'],
  },
  {
    title: 'Language & Region',
    description: 'Set your language and regional preferences',
    icon: Globe,
    items: ['Display language', 'Time zone', 'Date format'],
  },
  {
    title: 'Data & Storage',
    description: 'Manage your data and storage options',
    icon: Database,
    items: ['Data backup', 'Storage usage', 'Data retention'],
  },
  {
    title: 'Integrations',
    description: 'Connect with third-party services',
    icon: Zap,
    items: ['API keys', 'Webhooks', 'Connected apps'],
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your application preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category, index) => {
          const Icon = category.icon;

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item}</span>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

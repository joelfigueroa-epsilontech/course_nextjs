import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Database, FileText, Settings, Shield, Users } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Configure and manage your application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Core application configuration and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Put the application in maintenance mode</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Debug Mode</p>
                <p className="text-sm text-muted-foreground">Enable detailed error reporting</p>
              </div>
              <Badge variant="destructive">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Rate Limiting</p>
                <p className="text-sm text-muted-foreground">Control API request rates</p>
              </div>
              <Badge variant="secondary">100/min</Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>User registration and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">User Registration</p>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Require email verification for new users</p>
              </div>
              <Badge variant="secondary">Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Admin Approval</p>
                <p className="text-sm text-muted-foreground">Require admin approval for new accounts</p>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Settings
            </CardTitle>
            <CardDescription>Blog and content management configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-publish</p>
                <p className="text-sm text-muted-foreground">Automatically publish blog posts</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Content Moderation</p>
                <p className="text-sm text-muted-foreground">Review content before publishing</p>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Max Content Length</p>
                <p className="text-sm text-muted-foreground">Maximum characters per blog post</p>
              </div>
              <Badge variant="secondary">50,000</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Security and privacy configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Auth</p>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Badge variant="destructive">Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto-logout inactive users</p>
              </div>
              <Badge variant="secondary">24 hours</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">IP Whitelist</p>
                <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Settings
            </CardTitle>
            <CardDescription>Database configuration and backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-sm text-muted-foreground">Automatic database backups</p>
              </div>
              <Badge variant="secondary">Daily</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup Retention</p>
                <p className="text-sm text-muted-foreground">How long to keep backups</p>
              </div>
              <Badge variant="secondary">30 days</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Create Manual Backup
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure admin notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-muted-foreground">Send email notifications for critical events</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New User Alerts</p>
                <p className="text-sm text-muted-foreground">Notify when new users register</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Error Reports</p>
                <p className="text-sm text-muted-foreground">Receive error and crash reports</p>
              </div>
              <Badge variant="destructive">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button className="flex-1">Save Settings</Button>
        <Button variant="outline" className="flex-1">
          Reset to Defaults
        </Button>
        <Button variant="destructive" className="flex-1">
          Export Configuration
        </Button>
      </div>
    </div>
  );
}

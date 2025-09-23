import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, CreditCard, Download, Edit, Key, Mail, MapPin, Trash2, User } from 'lucide-react';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  initials: 'JD',
  role: 'Premium User',
  joinedDate: '2023-06-15',
  location: 'San Francisco, CA',
  bio: 'Full-stack developer passionate about creating amazing user experiences with modern web technologies.',
  stats: {
    postsPublished: 24,
    totalViews: '12.5K',
    followers: 156,
  },
};

export default function AccountPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal information and account details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="w-16 h-16 lg:w-20 lg:h-20 mx-auto sm:mx-0">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-base lg:text-lg font-semibold">{userData.initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg lg:text-xl font-semibold">{userData.name}</h3>
                    <Badge variant="secondary">{userData.role}</Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined{' '}
                      {new Date(userData.joinedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {userData.location}
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{userData.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account security and data</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Billing Information</p>
                    <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
              <CardDescription>Your content and engagement overview</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{userData.stats.postsPublished}</div>
                <div className="text-sm text-muted-foreground">Posts Published</div>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{userData.stats.totalViews}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{userData.stats.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

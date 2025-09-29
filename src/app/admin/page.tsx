import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserStatistics } from '@/lib/actions/profile-actions';
import { createClient } from '@/lib/supabase/server';
import { FileText, MessageSquare, Users } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number;
  totalBlogs: number;
  totalChats: number;
  totalMessages: number;
  recentBlogs: Array<{
    id: string;
    title: string;
    author: string;
    created_at: string;
  }>;
  recentProfiles: Array<{
    id: string;
    full_name: string | null;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
  }>;
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();

  try {
    // Get user statistics using the new RBAC function
    const userStats = await getUserStatistics();

    // Get counts for other entities
    const [blogsResult, chatsResult, messagesResult] = await Promise.all([
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('chats').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
    ]);

    // Get recent blogs (last 5)
    const { data: recentBlogs } = await supabase
      .from('blogs')
      .select('id, title, author, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent profiles (last 5)
    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      totalUsers: userStats.totalUsers,
      adminUsers: userStats.adminUsers,
      regularUsers: userStats.regularUsers,
      recentUsers: userStats.recentUsers,
      totalBlogs: blogsResult.count || 0,
      totalChats: chatsResult.count || 0,
      totalMessages: messagesResult.count || 0,
      recentBlogs: recentBlogs || [],
      recentProfiles: recentProfiles || [],
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      totalUsers: 0,
      adminUsers: 0,
      regularUsers: 0,
      recentUsers: 0,
      totalBlogs: 0,
      totalChats: 0,
      totalMessages: 0,
      recentBlogs: [],
      recentProfiles: [],
    };
  }
}

export default async function AdminHomePage() {
  const analyticsData = await getAnalyticsData();

  const stats = [
    {
      title: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      description: `${analyticsData.adminUsers} admins, ${analyticsData.regularUsers} users`,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Recent Users',
      value: analyticsData.recentUsers.toLocaleString(),
      description: 'New users (last 30 days)',
      icon: Users,
      color: 'text-cyan-500',
    },
    {
      title: 'Total Blogs',
      value: analyticsData.totalBlogs.toLocaleString(),
      description: 'Published blog posts',
      icon: FileText,
      color: 'text-green-500',
    },
    {
      title: 'Total Chats',
      value: analyticsData.totalChats.toLocaleString(),
      description: 'AI chat sessions',
      icon: MessageSquare,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your application&apos;s key metrics and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Blog Posts
            </CardTitle>
            <CardDescription>Latest blog posts created by users</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.recentBlogs.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{blog.title}</p>
                      <p className="text-sm text-muted-foreground">by {blog.author}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No blog posts yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent User Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent User Registrations
            </CardTitle>
            <CardDescription>Latest user registrations and profiles</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.recentProfiles.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentProfiles.map((profile) => (
                  <div key={profile.id} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{profile.full_name || 'Anonymous User'}</p>
                      <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          profile.role === 'admin'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}
                      >
                        {profile.role}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No user registrations yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

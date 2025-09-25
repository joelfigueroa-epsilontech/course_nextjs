import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { BarChart3, FileText, MessageSquare, Users } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalBlogs: number;
  totalChats: number;
  totalMessages: number;
  recentBlogs: Array<{
    id: string;
    title: string;
    author: string;
    created_at: string;
  }>;
  recentUsers: Array<{
    user_id: string | null;
    author: string;
    created_at: string;
  }>;
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();

  try {
    // Get counts for all entities
    const [blogsResult, chatsResult, messagesResult] = await Promise.all([
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('chats').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
    ]);

    // Count unique users from blog authors (as proxy for total users)
    const { data: blogAuthors } = await supabase.from('blogs').select('user_id, author');

    const uniqueUsers = new Set(blogAuthors?.map((b) => b.user_id).filter(Boolean) || []).size;

    // Get recent blogs (last 5)
    const { data: recentBlogs } = await supabase
      .from('blogs')
      .select('id, title, author, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent users from auth metadata (this is a workaround since we can't directly query auth.users)
    // In a real app, you'd have a profiles table or user metadata table
    const { data: recentUsers } = await supabase
      .from('blogs')
      .select('user_id, author, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      totalUsers: uniqueUsers,
      totalBlogs: blogsResult.count || 0,
      totalChats: chatsResult.count || 0,
      totalMessages: messagesResult.count || 0,
      recentBlogs: recentBlogs || [],
      recentUsers: recentUsers || [],
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      totalUsers: 0,
      totalBlogs: 0,
      totalChats: 0,
      totalMessages: 0,
      recentBlogs: [],
      recentUsers: [],
    };
  }
}

export default async function AdminHomePage() {
  const analyticsData = await getAnalyticsData();

  const stats = [
    {
      title: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-500',
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
    {
      title: 'Total Messages',
      value: analyticsData.totalMessages.toLocaleString(),
      description: 'Chat messages exchanged',
      icon: BarChart3,
      color: 'text-orange-500',
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

        {/* Recent User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent User Activity
            </CardTitle>
            <CardDescription>Latest user activity and registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentUsers.map((user, index) => (
                  <div
                    key={user.user_id || index}
                    className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.author}</p>
                      <p className="text-sm text-muted-foreground">Created content</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No user activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

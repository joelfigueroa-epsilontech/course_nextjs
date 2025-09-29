import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { BarChart3, Calendar, FileText, MessageSquare, TrendingUp, Users } from 'lucide-react';

interface DetailedAnalytics {
  userGrowth: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  contentStats: {
    totalBlogs: number;
    blogsThisWeek: number;
    averageLength: number;
    topAuthors: Array<{ author: string; count: number }>;
  };
  engagement: {
    totalChats: number;
    totalMessages: number;
    avgMessagesPerChat: number;
  };
  recentActivity: Array<{
    type: 'blog' | 'chat' | 'user';
    title: string;
    author: string;
    date: string;
  }>;
}

async function getDetailedAnalytics(): Promise<DetailedAnalytics> {
  const supabase = await createClient();

  try {
    // Get blogs data
    const { data: blogs } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });

    // Get chats data
    const { data: chats } = await supabase.from('chats').select('*, messages(count)').order('created_at', { ascending: false });

    // Get messages count
    const { data: messages } = await supabase.from('messages').select('*');

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate user growth (based on blog authors as proxy)
    const thisMonthAuthors = new Set(blogs?.filter((b) => new Date(b.created_at) >= thisMonthStart).map((b) => b.author) || []);
    const lastMonthAuthors = new Set(
      blogs?.filter((b) => new Date(b.created_at) >= lastMonthStart && new Date(b.created_at) < thisMonthStart).map((b) => b.author) || []
    );

    const userGrowth = {
      thisMonth: thisMonthAuthors.size,
      lastMonth: lastMonthAuthors.size,
      growth: lastMonthAuthors.size > 0 ? Math.round(((thisMonthAuthors.size - lastMonthAuthors.size) / lastMonthAuthors.size) * 100) : 0,
    };

    // Calculate content stats
    const blogsThisWeek = blogs?.filter((b) => new Date(b.created_at) >= thisWeekStart).length || 0;
    const averageLength = blogs?.length ? Math.round(blogs.reduce((sum, b) => sum + (b.content?.length || 0), 0) / blogs.length) : 0;

    // Top authors
    const authorCounts = new Map<string, number>();
    blogs?.forEach((blog) => {
      authorCounts.set(blog.author, (authorCounts.get(blog.author) || 0) + 1);
    });
    const topAuthors = Array.from(authorCounts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const contentStats = {
      totalBlogs: blogs?.length || 0,
      blogsThisWeek,
      averageLength,
      topAuthors,
    };

    // Calculate engagement
    const totalChats = chats?.length || 0;
    const totalMessages = messages?.length || 0;
    const avgMessagesPerChat = totalChats > 0 ? Math.round(totalMessages / totalChats) : 0;

    const engagement = {
      totalChats,
      totalMessages,
      avgMessagesPerChat,
    };

    // Recent activity
    const recentActivity = [
      ...(blogs?.slice(0, 5).map((blog) => ({
        type: 'blog' as const,
        title: blog.title,
        author: blog.author,
        date: blog.created_at,
      })) || []),
      ...(chats?.slice(0, 3).map((chat) => ({
        type: 'chat' as const,
        title: chat.title,
        author: 'User', // In real app, you'd get the actual user
        date: chat.created_at,
      })) || []),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    return {
      userGrowth,
      contentStats,
      engagement,
      recentActivity,
    };
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    return {
      userGrowth: { thisMonth: 0, lastMonth: 0, growth: 0 },
      contentStats: { totalBlogs: 0, blogsThisWeek: 0, averageLength: 0, topAuthors: [] },
      engagement: { totalChats: 0, totalMessages: 0, avgMessagesPerChat: 0 },
      recentActivity: [],
    };
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getDetailedAnalytics();

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Detailed insights into your application&apos;s performance and usage.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.userGrowth.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.userGrowth.growth >= 0 ? '+' : ''}
              {analytics.userGrowth.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Created</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.contentStats.blogsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Blogs this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Engagement</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.engagement.avgMessagesPerChat}</div>
            <p className="text-xs text-muted-foreground">Avg. messages per chat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Content Length</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.contentStats.averageLength / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">Characters per blog</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Authors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Content Creators
            </CardTitle>
            <CardDescription>Users with the most published blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.contentStats.topAuthors.length > 0 ? (
              <div className="space-y-4">
                {analytics.contentStats.topAuthors.map((author, index) => (
                  <div key={author.author} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{author.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {author.count} blog{author.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{author.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No content creators yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest user actions and content creation</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full mt-1">
                      {activity.type === 'blog' && <FileText className="h-4 w-4" />}
                      {activity.type === 'chat' && <MessageSquare className="h-4 w-4" />}
                      {activity.type === 'user' && <Users className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {activity.author} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

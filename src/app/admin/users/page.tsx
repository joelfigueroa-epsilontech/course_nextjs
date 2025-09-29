import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/server';
import { CalendarDays, FileText, MessageSquare, Search, Users } from 'lucide-react';

interface UserData {
  user_id: string;
  author: string;
  email?: string;
  blog_count: number;
  latest_blog: string | null;
  latest_activity: string;
}

async function getUsersData(): Promise<UserData[]> {
  const supabase = await createClient();

  try {
    // Get user data from blogs table (since we can't directly query auth.users)
    // This gives us users who have created blogs
    const { data: blogUsers } = await supabase
      .from('blogs')
      .select('user_id, author, created_at, title')
      .order('created_at', { ascending: false });

    if (!blogUsers) return [];

    // Group by user and calculate stats
    const userMap = new Map<string, UserData>();

    blogUsers.forEach((blog) => {
      const userId = blog.user_id || 'anonymous';
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          user_id: userId,
          author: blog.author,
          email: `${blog.author.toLowerCase().replace(' ', '.')}@example.com`, // Mock email
          blog_count: 0,
          latest_blog: null,
          latest_activity: blog.created_at,
        });
      }

      const user = userMap.get(userId)!;
      user.blog_count++;

      // Update latest blog if this one is more recent
      if (!user.latest_blog || new Date(blog.created_at) > new Date(user.latest_activity)) {
        user.latest_blog = blog.title;
        user.latest_activity = blog.created_at;
      }
    });

    return Array.from(userMap.values()).sort((a, b) => new Date(b.latest_activity).getTime() - new Date(a.latest_activity).getTime());
  } catch (error) {
    console.error('Error fetching users data:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsersData();

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all users in your application</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search Users
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <Users className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Active content creators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.reduce((sum, user) => sum + user.blog_count, 0)}</div>
            <p className="text-xs text-muted-foreground">Blog posts created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Posts per User</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.length > 0 ? (users.reduce((sum, user) => sum + user.blog_count, 0) / users.length).toFixed(1) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Average content output</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users who have created content in your application.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Blog Posts</TableHead>
                    <TableHead>Latest Blog</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {user.author
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.author}</div>
                            <div className="text-sm text-muted-foreground">ID: {user.user_id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {user.blog_count}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm" title={user.latest_blog || 'No blogs'}>
                          {user.latest_blog || 'No blogs yet'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(user.latest_activity).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">Users will appear here once they start creating content.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

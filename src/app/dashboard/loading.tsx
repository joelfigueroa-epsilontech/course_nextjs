import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="p-4 lg:p-6">
      {/* Header section */}
      <div className="mb-6 lg:mb-8">
        <div className="h-8 lg:h-9 bg-muted rounded-md animate-pulse mb-2" />
        <div className="h-5 bg-muted rounded-md animate-pulse w-3/4" />
      </div>

      {/* Recent blog posts section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
          <div className="h-7 lg:h-8 bg-muted rounded-md animate-pulse w-48" />
          <div className="h-5 bg-muted rounded-md animate-pulse w-20" />
        </div>

        {/* Blog cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="p-0">
                {/* Colored header skeleton */}
                <div className="relative h-32 bg-muted animate-pulse flex items-center justify-center">
                  {/* Icon skeleton */}
                  <div className="h-12 w-12 bg-white/20 rounded animate-pulse" />

                  {/* Category badge skeleton */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/20 h-5 w-12 rounded animate-pulse" />
                  </div>

                  {/* Reading time skeleton */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-white/20 h-4 w-16 rounded animate-pulse" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {/* Title skeleton */}
                <div className="h-6 bg-muted rounded-md animate-pulse mb-2" />
                <div className="h-6 bg-muted rounded-md animate-pulse mb-4 w-4/5" />

                {/* Subtitle skeleton */}
                <div className="h-4 bg-muted rounded-md animate-pulse mb-4 w-full" />
                <div className="h-4 bg-muted rounded-md animate-pulse mb-4 w-3/4" />

                {/* Author info skeleton */}
                <div className="flex items-center gap-3">
                  {/* Avatar skeleton */}
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />

                  {/* Author name and date skeleton */}
                  <div className="flex flex-col gap-1">
                    <div className="h-4 bg-muted rounded-md animate-pulse w-20" />
                    <div className="h-3 bg-muted rounded-md animate-pulse w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

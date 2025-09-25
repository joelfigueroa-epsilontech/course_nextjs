export default function Loading() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <div className="h-8 bg-muted animate-pulse rounded-md w-48 mb-2" />
        <div className="h-5 bg-muted animate-pulse rounded-md w-96" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
        ))}
      </div>
    </div>
  );
}

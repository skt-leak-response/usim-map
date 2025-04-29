import { Card, CardContent } from '@/components/ui/card';

export default function MemberListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-gray-700 rounded w-32"></div>
          <div className="h-10 bg-gray-700 rounded w-32"></div>
          <div className="h-10 bg-gray-700 rounded w-32"></div>
          <div className="h-10 bg-gray-700 rounded w-32"></div>
        </div>
      </div>

      {/* Selected Members and Next Button */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-700 rounded w-48"></div>
        <div className="h-10 bg-gray-700 rounded w-32"></div>
      </div>

      {/* Pagination and Member Cards */}
      <div className="space-y-2">
        <Card className="bg-gray-900 border-none">
          <CardContent className="p-3">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-700 rounded"></div>
                <div className="h-5 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 bg-gray-700 rounded w-8"></div>
                <div className="h-8 bg-gray-700 rounded w-8"></div>
                <div className="h-8 bg-gray-700 rounded w-8"></div>
                <div className="h-8 bg-gray-700 rounded w-8"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Cards */}
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="bg-gray-900 border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-5 w-5 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

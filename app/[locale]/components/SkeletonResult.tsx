export const SkeletonResult = () => {
  return (
    <>
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-[88px] bg-gray-200 rounded"></div>
      <div className="flex justify-between space-x-4">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-[68px]"></div>
      </div>
    </div>
    <div className="animate-pulse space-y-6">
      <div className="h-1 bg-gray-200 rounded mb-10 mt-3"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-14 bg-gray-200 rounded w-[196px]"></div>
    </div>
    </>
  );
};

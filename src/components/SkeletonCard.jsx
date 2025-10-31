export default function SkeletonCard() {
  return (
    <div className="w-40 flex-shrink-0">
      <div className="bg-gray-700 animate-pulse rounded-lg h-[240px] w-full"></div>
      <div className="bg-gray-700 animate-pulse rounded-md h-4 mt-2 w-3/4 mx-auto"></div>
    </div>
  );
}
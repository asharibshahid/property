export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F7F4EF] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <div className="h-8 w-44 rounded-md bg-[#07111F]/10 shimmer" />
        <div className="h-14 max-w-2xl rounded-md bg-[#07111F]/10 shimmer" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 rounded-md border border-[#07111F]/8 bg-white shadow-sm shimmer"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

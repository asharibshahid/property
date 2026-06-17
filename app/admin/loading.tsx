export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#F7F4EF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-10 w-56 rounded-md bg-[#07111F]/10 shimmer" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-md bg-white shimmer" />
          ))}
        </div>
        <div className="mt-8 h-96 rounded-md bg-white shimmer" />
      </div>
    </main>
  );
}

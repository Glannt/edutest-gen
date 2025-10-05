export default function DashboardPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <p>
        Welcome to your dashboard. This is the main page of your application.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='p-6 rounded-lg border border-divider bg-content1 shadow-sm'
          >
            <h3 className='text-lg font-medium mb-2'>Card {i}</h3>
            <p className='text-foreground-600'>
              This is a sample card with some content.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

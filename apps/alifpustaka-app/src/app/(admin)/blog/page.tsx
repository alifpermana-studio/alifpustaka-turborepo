// app/[username]/page.tsx

import { BlogComponent } from '@/components/blog/BlogComponent';

// ⚡ This runs on the server before rendering
export async function generateMetadata() {
  return {
    title: 'Blog Post Management',
    description: 'Share your knowledge start from here.',
  };
}

export default function Page() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          Blog Post Management
        </h3>
        <div className="space-y-6">
          <BlogComponent />
        </div>
      </div>
    </div>
  );
}

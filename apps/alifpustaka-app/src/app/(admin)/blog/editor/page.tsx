// app/[username]/page.tsx
import { prisma } from '@/lib/prisma';
import Editor from '@/components/blog/editor/Editor';
import { readCurrentToken } from '@/lib/read-current-token';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';

// ⚡ This runs on the server before rendering
export async function generateMetadata() {
  return {
    title: 'Blog Post Editor',
    description: 'Share your knowledge start from here.',
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const token = await readCurrentToken();
  const key = (await searchParams).key || '';

  const findPost = await prisma.post.findUnique({
    where: { id: key },
    include: {
      tags: {
        include: {
          tag: true, // Include the full tag data from the Tag model
        },
      },
    },
  });

  if (findPost) {
    if (token?.sub === findPost?.userId) {
      const metadata = {
        id: findPost?.id || '',
        title: findPost?.title || '',
        slug: findPost?.slug || '',
        image: findPost?.image || '',
        desc: findPost?.desc || '',
        tags: findPost?.tags.map((postTag) => postTag.tag.name) || [],
      };
      return (
        <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Post Editor
            </h3>
            <div className="space-y-6">
              <Editor storageKey={key} postMd={findPost?.content || ''} postMetadata={metadata} />
            </div>
          </div>
        </div>
      );
    } else {
      redirect(`/blog?error=no-permission`);
    }
  } else if (!key) {
    const newKey = v4();
    return (
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Post Editor
          </h3>
          <div className="space-y-6">
            <Editor storageKey={newKey} />
          </div>
        </div>
      </div>
    );
  } else {
    redirect(`/blog?error=post-not-found`);
  }
}

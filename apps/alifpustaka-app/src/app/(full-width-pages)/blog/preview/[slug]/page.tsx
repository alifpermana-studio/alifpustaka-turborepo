// app/[username]/page.tsx
import { prisma } from '@/lib/prisma';
import { readCurrentToken } from '@/lib/read-current-token';
import { redirect } from 'next/navigation';
import Preview from '@/components/blog/preview/Preview';

// ⚡ This runs on the server before rendering
export async function generateMetadata() {
  return {
    title: 'Blog Post Preview',
    description: 'Share your knowledge start from here.',
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ [slug: string]: string | undefined }>;
}) {
  const token = await readCurrentToken();
  const { slug } = await params;

  console.log('Check slug: ', slug);

  const findPost = await prisma.post.findUnique({
    where: { slug: slug },
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
            <div className="space-y-6">
              <Preview md={findPost?.content || ''} metadata={metadata} />
            </div>
          </div>
        </div>
      );
    } else {
      redirect(`/blog?error=no-permission`);
    }
  } else {
    redirect(`/blog?error=post-not-found`);
  }
}

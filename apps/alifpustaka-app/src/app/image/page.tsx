import { Metadata } from 'next';
import ZoomableImage from '@/components/image/ZoomableImage';

export const metadata: Metadata = {
  title: 'Alif Pustaka Portal | Reset Password',
  description: 'Reset your password here.',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const p = (await searchParams).p;
  const src = (await searchParams).src;

  const href = `/api/image?p=${p}&src=${src}`;

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black">
      <ZoomableImage src={href} alt="test" />

      {/* <Image
            src={href} // Put your image in /public
            alt="Showcased image"
            fill
            className="object-contain" // keeps full image visible, no cropping
            priority
          /> */}
    </main>
  );
}

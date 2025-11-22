'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import {
  CustomTable,
  CustomImg,
  CustomCode,
  CustomOL,
  CustomUL,
  PreComponent,
} from '../editor/MdComponents';
import { useRouter } from 'next/navigation';
import { MoveLeft } from 'lucide-react';

type MarkdownEditorProps = {
  md?: string;
  metadata?: MetadataType;
  className?: string;
};

type MetadataType = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tags: string[];
  desc: string;
};

export default function Editor({ md = '', metadata }: MarkdownEditorProps) {
  const router = useRouter();
  const preview = useMemo(
    () => (
      <div className="max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1(props) {
              return <h1 className="mt-8 mb-4 text-3xl font-semibold">{props.children}</h1>;
            },
            table(props) {
              return <CustomTable props={props} />;
            },
            h2(props) {
              return <h2 className="mt-8 mb-4 text-2xl font-semibold">{props.children}</h2>;
            },
            h3(props) {
              return <h3 className="mt-8 mb-4 text-xl font-semibold">{props.children}</h3>;
            },
            p(props) {
              return <p className="my-4 text-lg">{props.children}</p>;
            },
            hr() {
              return <hr className="my-8 border-amber-400" />;
            },
            img(props) {
              return <CustomImg props={props} />;
            },
            code(props) {
              return <CustomCode props={props} />;
            },
            ol(props) {
              return <CustomOL props={props} />;
            },
            ul(props) {
              return <CustomUL props={props} />;
            },

            pre(props) {
              return <PreComponent props={props} />;
            },
          }}
        >
          {md}
        </ReactMarkdown>
      </div>
    ),
    [md],
  );

  console.log(metadata);

  return (
    <div>
      <div
        onClick={() => router.push(`/blog`)}
        className="flex w-fit origin-left cursor-pointer flex-row gap-4 text-gray-800 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-110 dark:text-white/90"
      >
        <MoveLeft />
        <h3 className="mb-5 text-lg font-semibold lg:mb-7">Back to Blog</h3>
      </div>
      <div className="rounded-xl border border-gray-600 bg-gray-900 p-4">{preview}</div>
    </div>
  );
}

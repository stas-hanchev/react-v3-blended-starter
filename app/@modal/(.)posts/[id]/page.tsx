import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import PostPreviewClient from './PostPreview.client';
import { fetchPostById } from '@/lib/api';
// import { fetchPostById } from '@/lib/api';

interface PostDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function PostPreview({ params }: PostDetailsProps) {
  const queryClient = new QueryClient();

  const { id } = await params;
  const parsedId = Number(id);
  await queryClient.prefetchQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPreviewClient />
    </HydrationBoundary>
  );
}

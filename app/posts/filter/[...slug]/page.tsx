// import { fetchPosts } from '@/lib/api';

import { fetchPosts } from "@/lib/api";
import PostsClient from "./Posts.client";

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PostsPage({ params }: PostPageProps) {
  const { slug } = await params;
  const userId = slug[0];
  const data = await fetchPosts({
    searchText: '',
    page: 1,
    ...(userId && userId !== 'All' && { userId })
  });
  console.log(data);
  return <PostsClient initialData={data} userId={userId}/>;
}

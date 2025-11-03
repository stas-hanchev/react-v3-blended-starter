'use client';

import Modal from '@/components/Modal/Modal';
import css from './PostPreview.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { User } from '@/types/user';

export default function PostPreviewClient() {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);
  const router = useRouter();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
    refetchOnMount: false
  });

  const handleClickBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!post) return;
    const fn = async () => {
      const res = await fetchUserById(post.userId);
      setUser(res);
    };
    fn();
  }, [post]);

  if (isLoading) return <p>Loading</p>
  if (error) return <p>Something went wrong...</p>

  return (
    <Modal onClose={handleClickBack}>
      <button className={css.backBtn} onClick={handleClickBack}>← Back</button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{ post?.title }</h2>
          </div>

          <p className={css.content}>{ post?.body }</p>
        </div>
        <p className={css.user}>{ user?.name }</p>
      </div>
    </Modal>
  );
}

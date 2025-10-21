import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [debouncedQuery] = useDebounce(query, 500);
  
  // Об'єднуємо стани модалки для створення і редагування поста
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | null;
    editedPost: Post | null;
  }>({
    isOpen: false,
    mode: null,
    editedPost: null,
  });

  const { data } = useQuery({
    queryKey: ['posts', debouncedQuery, page],
    queryFn: () => fetchPosts(debouncedQuery, page),
    placeholderData: keepPreviousData
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const toggleModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const openCreatePost = () => {
    setModalState({ isOpen: true, mode: 'create', editedPost: null });
  };

  const openEditPost = (postToEdit: Post) => {
    setModalState({ isOpen: true, mode: 'edit', editedPost: postToEdit });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: null, editedPost: null });
  };

  const posts = data?.posts ?? [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button className={css.button} onClick={openCreatePost}>Create post</button>
      </header>
      {modalState.isOpen && (
        <Modal onClose={closeModal}>
          {modalState.mode === 'create' && (
            <CreatePostForm onClose={closeModal} />
          )}
          {modalState.mode === 'edit' && modalState.editedPost && (
            <EditPostForm
              initialValues={modalState.editedPost}
              onClose={closeModal}
            />
          )}
        </Modal>
      )}
      {posts.length > 0 && (
        <PostList
          posts={posts}
          toggleModal={toggleModal}
          openEditPost={openEditPost}
        />
      )}
    </div>
  );
}


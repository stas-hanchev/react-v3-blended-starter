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
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const { data } = useQuery({
    queryKey: ['posts', debouncedQuery, page],
    queryFn: () => fetchPosts(debouncedQuery, page),
    placeholderData: keepPreviousData
  });

  const handleSearch = (newQuery: string) => {
    // console.log(query);
    setQuery(newQuery);
    setPage(1);
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const toggleCreatePost = () => {
    setIsCreatePost(!isCreatePost);
  }

  const toggleEditPost = (postToEdit?: Post) => {
    if (postToEdit) {
      setEditedPost(postToEdit);
    }
    setIsEditPost(!isEditPost);
  }

  const posts = data?.posts ?? [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={handleSearch} />
        { totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage}/>}
        <button className={css.button} onClick={() => {
          toggleModal();
          toggleCreatePost();
        }}>Create post</button>
      </header>
      {isModalOpen && <Modal onClose={/*toggleModal*/ () => {
          toggleModal();
          toggleCreatePost();
      }}>{
          isCreatePost && <CreatePostForm onClose={() => {
            toggleModal();
            toggleCreatePost();
          }}></CreatePostForm>}
        {isEditPost && <EditPostForm
          initialValues={editedPost!}
          onClose={() => {
            toggleModal();
            toggleEditPost();
            setEditedPost(null);
          }}
        >
        </EditPostForm>}  
      </Modal>}
      {posts.length > 0 && <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />}
    </div>
  );
}

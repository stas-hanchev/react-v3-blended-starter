import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import type { Photo } from '../../types/photo';

import { getPhotos } from "../../services/photos";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
// import Modal from "../Modal/Modal";
import ImageModal from "../ImageModal";
import Button from "../Button/Button";

export default function App() {
  const [images, setImages] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const [modalIsOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectedPhoto = (photo: Photo | null) => {
    setIsOpen(true);
    setSelectedPhoto(photo);
  }

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPhoto(null);
  }

  const handleSubmit = async (newQuery: string) => {
    setQuery(newQuery);
    setIsError(false);
    setImages([]);
    setPage(1);
  }

  useEffect(() => {
    if (!query) return;
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const data = await getPhotos(query, page);
        if (!data.photos.length) {
          toast.error('For this request photos is not available!');
          return;
        }
        setImages(prev => [...prev, ...data.photos]);
        setIsVisible(page < Math.ceil(data.total_results / data.per_page));
      } catch (error) {
        setIsError(true);
        console.error(`Error`, error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPhotos();
  }, [page, query]);

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  }
  
  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSubmit}></Form>
          {isLoading && <Loader />}
          {isError && <Text>Sorry, something went wrong!</Text>}
          {images.length > 0 && <PhotosGallery photos={images} handleSelectedPhoto={handleSelectedPhoto} />}
          {/* {selectedPhoto && <Modal onClose={() => setSelectedPhoto(null)}>
            <div
              style={{
                backgroundColor: selectedPhoto.avg_color,
                borderColor: selectedPhoto.avg_color,
              }}>
              <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
            </div>
          </Modal> } */}
          <ImageModal modalIsOpen={modalIsOpen} closeModal={closeModal} selectedPhoto={selectedPhoto} />
        </Container>
        {isVisible && <Button onClick={onLoadMore} disabled={isLoading}>{isLoading ? "Loading..." : "Load more"}</Button>}
      </Section>
      <Toaster></Toaster>
    </>
  );
}

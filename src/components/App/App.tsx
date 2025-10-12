import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

import type { Photo } from '../../types/photo';

import { getPhotos } from "../../services/photos";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSelectedPhoto = (photo: Photo | null) => {
    setSelectedPhoto(photo);
  }

  const handleSubmit = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      const fetchedPhotos = await getPhotos(query);
      if (!fetchedPhotos.length) {
        toast.error('For this request photos is not available!');
        return;
      }
      setPhotos(fetchedPhotos);
    } catch (error) {
      setIsError(true);
      console.error(`Error`, error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSubmit}></Form>
          {isLoading && <Loader />}
          {isError && <Text>Sorry, something went wrong!</Text>}
          {photos.length > 0 && <PhotosGallery photos={photos} handleSelectedPhoto={handleSelectedPhoto} />}
          {selectedPhoto && <Modal onClose={() => setSelectedPhoto(null)}>
            <div
              style={{
                backgroundColor: selectedPhoto.avg_color,
                borderColor: selectedPhoto.avg_color,
              }}>
              <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
            </div>
          </Modal> }
        </Container>
      </Section>
      <Toaster></Toaster>
    </>
  );
}

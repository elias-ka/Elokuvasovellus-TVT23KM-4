import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Title,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import CastCarousel from "./CastCarousel.jsx";
import useAuth from "../../hooks/useAuth";
import useFav from "../../hooks/useFav";
import { getFavorites, addFavorite } from "../../data/favorites";

export default function MediaDetailsPage() {
  const { username, userId, isLoggedIn } = useAuth();
  const { favorites, setFavorites } = useFav();
  const location = useLocation();
  const navigate = useNavigate();
  const [mediaObj, setMediaObj] = useState(location.state.obj);
  const [images, setImages] = useState([]);
  const [credits, setCredits] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getImages();
    getCredits();
    getGenres();
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    if (isLoggedIn && username) {
      console.log("Trying to fetch favorites.");
      try {
        const results = await getFavorites(username);
        const searchResults = results.data;
        console.log("Results data:");
        console.log(searchResults);
        setFavorites(searchResults)
        
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getImages = async () => {
    const URL = `http://localhost:8000/search/${mediaObj.title ? "movie" : "tv"}/images/${mediaObj.id}`;
    const data = await fetch(URL);
    const searchResults = await data.json();
    const limitedImages = searchResults.backdrops.slice(0, 20);
    setImages(() => limitedImages);
  };

  const getCredits = async () => {
    setIsLoading(true);
    const URL = `http://localhost:8000/search/${mediaObj.title ? "movie" : "tv"}/credits/${mediaObj.id}`;
    const data = await fetch(URL);
    const searchResults = await data.json();
    setCredits(() => searchResults);
    setIsLoading(false);
  };

  const getGenres = async () => {
    const URL = `http://localhost:8000/search/genres/${mediaObj.title ? "movie" : "tv"}`;
    const data = await fetch(URL);
    const searchResults = await data.json();
    const currentObjGenres = new Set(mediaObj.genre_ids);
    const filteredGenres = searchResults.genres.filter((genre) => currentObjGenres.has(genre.id));
    setGenres(() => filteredGenres);
  };

  const baseURL = "https://image.tmdb.org/t/p/original";

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const imageSlides = images.map((image) => (
    <Carousel.Slide key={image.file_path}>
      <Image src={baseURL + image.file_path}></Image>
    </Carousel.Slide>
  ));

  return (
    <Container size="lg" mt="lg">
      <ActionIcon variant="outline" onClick={() => navigate(-1)}>
        <IconArrowLeft></IconArrowLeft>
      </ActionIcon>
      <Card shadow="lg" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Carousel
            slideSize={{ base: "100%", sm: "100%" }}
            slideGap={{ base: "md", sm: "xl" }}
            align="start"
            slidesToScroll={mobile ? 1 : 1}
            controlSize={30}
          >
            {imageSlides}
          </Carousel>
        </Card.Section>
        <Title ta="center" mt="md" order={1}>
          {mediaObj.title || mediaObj.name}
        </Title>
        <Text ta="center" size="xl" mt="md">
          {mediaObj.overview}
        </Text>
        <Container>
          <Badge variant="light" color="blue" size="xl" radius="md" mt="md">
            {"Release date: " + (mediaObj.release_date || mediaObj.first_air_date)}
          </Badge>
        </Container>
        <Group justify="center">
          {genres.map((genre) => (
            <Badge key={genre.id} color="gray" size="xl" radius="md" mt="md">
              {genre.name}
            </Badge>
          ))}
        </Group>
        <Title ta="center" c="blue" mt="md" order={2}>
          Cast
        </Title>

        {console.log("Favorites")}
        {console.log(favorites)}

        {!isLoading && credits.cast && <CastCarousel creditsArray={credits} />}

        {isLoggedIn && (
          <Button color="blue" mt="md" radius="md" fullWidth >
            Add to favorites
          </Button>
        )}

        {/* <Button color="blue" mt="md" radius="md" fullWidth>
          Add to favorites
        </Button> */}
      </Card>
    </Container>
  );
}

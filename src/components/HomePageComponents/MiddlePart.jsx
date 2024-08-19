import { CircularProgress, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllBookAction } from "../../redux/book/book.action";
import { BannerItem } from "./BannerItem";
import BookItem from "./BookItem";
function getSliderSettings(slidesToShow, isDotsNeeded, isInfinite, isAutoPlay) {
  const responsiveSettings = [
    { breakpoint: 1366, slidesToShow: slidesToShow > 1 ? slidesToShow - 1 : slidesToShow },
    { breakpoint: 1280, slidesToShow: slidesToShow > 2 ? slidesToShow - 2 : slidesToShow },
    { breakpoint: 1024, slidesToShow: slidesToShow > 2 ? slidesToShow - 2 : slidesToShow },
    { breakpoint: 600, slidesToShow: 1 },
    { breakpoint: 480, slidesToShow: 1 },
  ];

  return {
    dots: isDotsNeeded,
    infinite: isInfinite,
    autoplay: isAutoPlay,
    autoplaySpeed: 3000,
    cssEase: "linear",
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    draggable: true,
    mobileFirst: true,
    swipe: true,
    swipeToSlide: true,
    responsive: responsiveSettings.map(({ breakpoint, slidesToShow, initialSlide }) => ({
      breakpoint,
      settings: {
        slidesToShow,
        slidesToScroll: slidesToShow,
        infinite: isInfinite,
        dots: isDotsNeeded,
        ...(initialSlide !== undefined && { initialSlide }),
      },
    })),
  };
}

var images = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    imgPath: "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bird",
    imgPath: "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bali, Indonesia",
    imgPath: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250",
  },
  {
    label: "Goč, Serbia",
    imgPath: "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
];

export default function MiddlePart() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(null);
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      if (jwt) {
        setLoading(true);
        try {
          const results = await dispatch(getAllBookAction());
          setBooks(results.payload);
        } catch (error) {
          console.log("Error getting books: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooks();
  }, [dispatch, jwt]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className="max-h-64 rounded-md" sx={{ maxWidth: "100%", flexGrow: 1 }}>
      <section className="pb-5">
        <Slider {...getSliderSettings(1, false, true, true)}>
          {images.map((item, i) => (
            <div key={i} className="slider-container">
              <BannerItem item={item} />
            </div>
          ))}
        </Slider>
      </section>
      <section className="py-5" id="bookSection">
        <div className="text-start text-xl font-bold italic mx-5 bg-orange-200 rounded-lg py-5">
          <div className="ml-5">Books section</div>
        </div>
        <div className="py-5">
          <Grid className="justify-center items-center pl-5">
            <Slider {...getSliderSettings(4, true, false, false)}>
              {Array.isArray(books) &&
                books.map((item, i) => (
                  <div className="slider-container" key={i} onClick={() => navigate(`/books/${item.id}`)}>
                    <BookItem item={item} />
                  </div>
                ))}
            </Slider>
          </Grid>
        </div>
      </section>
    </Box>
  );
}

import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Step Into Style",
    subtitle: "Discover premium footwear for every occasion",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
  },
  {
    id: 2,
    title: "Fresh Drops Weekly",
    subtitle: "Be the first to grab the latest sneaker releases",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
  },
  {
    id: 3,
    title: "Performance & Comfort",
    subtitle: "Shoes that keep up with your lifestyle",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=80",
  }
];

export default function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    pauseOnHover: false
  };

  return (
    <section className="relative text-white overflow-hidden">
      <Slider {...settings}>
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative h-[90vh] flex items-center">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-6 flex flex-col md:flex-row items-center justify-between py-55">
              <div className="max-w-lg text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                  {slide.subtitle}
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Link
                    to="/products"
                    className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Shop Now
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link
                    to="/#featured"
                    className="inline-flex items-center border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    See Featured Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

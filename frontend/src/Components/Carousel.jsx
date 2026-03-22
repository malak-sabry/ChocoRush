import { useState, useEffect, useRef } from "react";

import { FaStar } from "react-icons/fa";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
const Carousel = () => {
  const products = [
    { id: 1, name: "Milk-filled chocolate", price: "$15.00", rating: "5.0" },
    { id: 2, name: "Dark chocolate bar", price: "$12.00", rating: "4.8" },
    { id: 3, name: "White chocolate delight", price: "$14.50", rating: "5.0" },
    { id: 4, name: "Chocolate delight", price: "$14.50", rating: "5.0" },
    { id: 5, name: "Hazelnut delight", price: "$14.50", rating: "5.0" },
  ];

  const CARD_WIDTH = 420;
  const CENTER_WIDTH = 440;
  const GAP = 40;

  const sideOffset = CENTER_WIDTH / 2 + GAP + CARD_WIDTH / 2;

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((index + products.length) % products.length);
    setTimeout(() => setAnimating(false), 400);
  };

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  useEffect(() => {
    timeoutRef.current = setTimeout(next, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [activeIndex]);

  const getCardStyle = (i) => {
    const n = products.length;
    let diff = (i - activeIndex + n) % n;
    if (diff > n / 2) diff -= n;

    if (diff === 0) {
      return {
        zIndex: 10,
        transform: `translateX(0px) scale(1)`,
        opacity: 1,
        pointerEvents: "auto",
        width: `${CENTER_WIDTH}px`,
      };
    } else if (diff === 1) {
      return {
        zIndex: 5,
        transform: `translateX(${sideOffset}px) scale(1)`,
        opacity: 1,
        pointerEvents: "auto",
        width: `${CARD_WIDTH}px`,
      };
    } else if (diff === -1) {
      return {
        zIndex: 5,
        transform: `translateX(-${sideOffset}px) scale(1)`,
        opacity: 1,
        pointerEvents: "auto",
        width: `${CARD_WIDTH}px`,
      };
    } else {
      return {
        zIndex: 0,
        transform: diff > 0
          ? `translateX(${sideOffset * 2}px) scale(0.8)`
          : `translateX(-${sideOffset * 2}px) scale(0.8)`,
        opacity: 0,
        pointerEvents: "none",
        width: `${CARD_WIDTH}px`,
      };
    }
  };

  const isCenter = (i) => i === activeIndex;
  return (
    <>

      {/* Carousel */}
      <div className="relative flex justify-center items-center px-6 overflow-hidden">
        <div className="relative flex justify-center items-center w-full h-[360px]">
          {products.map((product, i) => (
            <div
              key={product.id}
              onClick={() => !isCenter(i) && goTo(i)}
              style={{
                position: "absolute",
                transition: "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s ease, width 0.4s ease",
                ...getCardStyle(i),
              }}
              className={`
                flex flex-col items-center text-center shadow-lg rounded-full cursor-pointer select-none
                ${isCenter(i)
                  ? "bg-[#1C120A] text-[#E8DED3] py-14 px-8"
                  : "bg-[#968C82] text-[#E8DED3] py-10 px-6"}
              `}
            >
              <h3 className={`text-lg font-semibold ${!isCenter(i) ? "text-[#2E1F1B]" : ""}`}>
                {product.name}
              </h3>

              <p className={`font-medium mt-1 ${isCenter(i) ? "text-[#E8DED3]" : "text-[#3E2A25]"}`}>
                {product.price}
              </p>

              <span className="mt-2 flex items-center gap-2 bg-[#DED7DA]/40 px-3 py-1 rounded-full shadow">
                <span className="text-sm font-medium">{product.rating}</span>
                <FaStar className="text-yellow-300/70" />
              </span>

              <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#D9CCBE] rounded-full shadow hover:bg-[#cbbca9] transition text-[#4F342F] font-medium cursor-pointer">
                Add To Cart
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 z-20 bg-[#1C120A]/80 hover:bg-[#1C120A] text-[#E8DED3] rounded-full p-2 shadow-lg transition cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 z-20 bg-[#1C120A]/80 hover:bg-[#1C120A] text-[#E8DED3] rounded-full p-2 shadow-lg transition cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6 mb-4">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex
              ? "w-6 h-2.5 bg-[#1C120A]"
              : "w-2.5 h-2.5 bg-[#968C82]"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </>)
}

export default Carousel
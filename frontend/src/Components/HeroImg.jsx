import heroImg from "../assets/delicious_food.png";
import grainImg from "../assets/grains.png";

const HeroImg = () => {
  return (
    <div className="hero relative w-full">
      <img
        src={heroImg}
        className="w-4/5 sm:w-2/3 md:w-1/2 mx-auto"
        alt="Delicious food"
      />
      <img
        src={grainImg}
        alt="grains"
        className="absolute w-16 sm:w-24 md:w-32 top-4 sm:top-6 md:top-10 right-2 sm:right-6 md:right-10"
      />
    </div>
  );
};

export default HeroImg;
import heroImg from "../assets/delicious_food.png";
import grainImg from "../assets/grains.png";
const HeroImg = () => {
  return (
    <>
    {/* Hero Images */}
      <div className="hero relative ">
        <img src={heroImg} className="w-1/2 mx-auto" alt="Delicious food" />
        <img
          src={grainImg}
          alt="grains"
          className="absolute w-32 top-10 right-10"
        />
      </div>
    </>
  )
}

export default HeroImg
import { MoveLeft } from "lucide-react";
import Layout from "../Components/Layout";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Layout>


        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">

          {/* Decorative blurred blobs */}
          <div className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-[#c9956a] opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[#7a4f35] opacity-15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#7a4f35] opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-[#7a4f35] opacity-15 pointer-events-none" />

          {/* Floating dots */}
          <div className="absolute top-[12%] left-[8%] w-2 h-2 rounded-full bg-[#7a4f35] opacity-30 pointer-events-none" />
          <div className="absolute top-[25%] right-[12%] w-3 h-3 rounded-full bg-[#7a4f35] opacity-20 pointer-events-none" />
          <div className="absolute bottom-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#7a4f35] opacity-25 pointer-events-none" />
          <div className="absolute bottom-[35%] right-[8%] w-2 h-2 rounded-full bg-[#7a4f35] opacity-20 pointer-events-none" />
          <div className="absolute top-[60%] left-[5%] w-1 h-1 rounded-full bg-[#7a4f35] opacity-30 pointer-events-none" />
          <div className="absolute top-[40%] right-[5%] w-1.5 h-1.5 rounded-full bg-[#7a4f35] opacity-25 pointer-events-none" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center text-center">

            {/* 404 */}
            <div className="flex items-center gap-1 mb-2">
              <span className="font-serif text-[clamp(100px,15vw,160px)] font-black text-[#3c2521] leading-none drop-shadow-lg animate-bounce">
                4
              </span>

              {/* The O as a circle */}
              <div className="w-[clamp(90px,12vw,140px)] h-[clamp(90px,12vw,140px)] rounded-full bg-gradient-to-br from-[#c9956a] to-[#7a4f35] flex items-center justify-center shadow-2xl ring-4 ring-[#7a4f35] ring-offset-2 animate-pulse mx-1 shrink-0">
                <span className="font-serif text-[clamp(60px,8vw,95px)] font-black text-[#f5ede3] leading-none drop-shadow-md">
                  0
                </span>
              </div>

              <span className="font-serif text-[clamp(100px,15vw,160px)] font-black text-[#3c2521] leading-none drop-shadow-lg animate-bounce [animation-delay:150ms]">
                4
              </span>
            </div>

            {/* Divider */}
            <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-[#7a4f35] to-transparent rounded-full my-6" />

            {/* Text */}
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#3c2521] tracking-wide mb-3">
              Lost in the wilderness
            </h1>
            <p className="text-[#7a5c4a] font-light text-sm md:text-base leading-relaxed max-w-sm mb-10">
              The page you're looking for has wandered off the beaten path.
              <br />
              Let's guide you back home.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/")}
              className="bg-[#4F342F] text-[#f5ede3] px-10 py-3 rounded-full text-xs uppercase tracking-widest
          transition-all duration-300 ease-in-out shadow-lg shadow-[#4F342F44]
          hover:bg-[#3c2521] hover:scale-105 hover:shadow-xl hover:-translate-y-1
          active:scale-95 cursor-pointer"
            >
              <MoveLeft /> Back to Home
            </button>
          </div>

          {/* Bottom strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7a4f35] via-[#c9956a] to-[#4F342F]" />

          <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif !important; }
        body { font-family: 'Lato', sans-serif; }
      `}</style>
        </div>
      </Layout>
    </>


  );
};

export default NotFound;
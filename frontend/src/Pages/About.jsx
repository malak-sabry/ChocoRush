import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Layout from "../Components/Layout";

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes! ChocoRush ships worldwide. International delivery typically takes 7–14 business days depending on your location. All orders are carefully packaged to ensure your chocolates arrive in perfect condition.",
  },
  {
    question: "Can I customize my ChocoRush chocolate box?",
    answer:
      "Absolutely. We offer fully customizable boxes — choose your flavors, quantity, and even add a personalized message card. Perfect for gifting or treating yourself.",
  },
  {
    question: "Are ChocoRush chocolates suitable for people with allergies?",
    answer:
      "Our chocolates are made in a facility that handles nuts, dairy, gluten, and soy. Each product listing includes a full allergen list. Please review carefully before ordering if you have sensitivities.",
  },
  {
    question: "What should I do if my order is damaged or incorrect?",
    answer:
      "We're so sorry to hear that! Please contact our support team within 48 hours of delivery with a photo of the issue. We'll make it right with a replacement or full refund.",
  },
  {
    question: "Do you have any vegan or dairy-free options?",
    answer:
      "Yes! We have a dedicated vegan collection crafted with oat milk and dark cacao. Browse our 'Plant-Based' category to explore options that are just as indulgent.",
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <Layout>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen px-4 sm:px-6 py-10 sm:py-16 bg-[#E8DED3] font-serif mb-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-12 sm:gap-16">

          {/* ── Our Story Section ── */}
          <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-[#E3D0B5] border border-[#E4D1B6] shadow-md">

            {/* Decorative corner accent */}
            <div className="absolute top-0 left-0 w-24 h-24 rounded-br-full opacity-40 pointer-events-none bg-[#E4D1B6]" />

            <div className="relative flex flex-col sm:flex-row items-start gap-8 sm:gap-10">

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.15em] mb-2 text-[#7a5c3a]">
                  Our story
                </p>
                <h2 className="mb-5 font-semibold leading-none text-3xl sm:text-4xl text-[#2a1206] tracking-tight">
                  ChocoRush
                </h2>
                <p className="text-sm mb-8 text-[#4a2a10] leading-[1.85]">
                  ChocoRush started with a simple love for chocolate. We wanted to
                  create a unique experience for those who truly appreciate the real
                  taste of chocolate and savor life's little moments. By using the
                  finest ingredients and traditional techniques, ChocoRush crafts
                  chocolates that not only delight your taste buds but also offer a
                  sense of comfort and joy with every bite. Our story is one of
                  passion, craft, and the endless pursuit of the perfect bite.
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 bg-[#2a1206] text-[#EEE3CE] hover:bg-[#4a2a10] hover:translate-x-1 border-none">
                  <ArrowRight size={14} />
                  Read more
                </button>
              </div>

              {/* Stacked image cards */}
              <div className="relative flex-shrink-0 w-full sm:w-[280px] h-[200px] sm:h-[260px]">
                {/* Back card */}
                <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 rounded-2xl rotate-[8deg] bg-[#4a2a10] shadow-xl" />
                {/* Mid card */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-36 h-36 sm:w-48 sm:h-48 rounded-2xl rotate-[3deg] bg-[#BD9971] shadow-lg" />
                {/* Front card with image */}
                <div className="absolute top-8 right-8 sm:top-10 sm:right-10 w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&crop=center"
                    alt="Chocolate tower"
                    className="w-full h-full object-cover block"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ── FAQs Section ── */}
          <section>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-xs uppercase tracking-[0.15em] mb-2 text-[#7a5c3a]">
                Got questions?
              </p>
              <h2 className="font-semibold text-3xl sm:text-4xl text-[#2a1206] tracking-tight">
                F&amp;Qs
              </h2>
              <div className="w-10 h-0.5 rounded-full mx-auto mt-3 bg-[#7a5c3a]" />
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl border border-[#E4D1B6] transition-all duration-300 ${
                    openIndex === i ? "bg-[#DFCCB2]" : "bg-[#EEE3CE]"
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left bg-transparent border-none cursor-pointer"
                  >
                    <span
                      className={`text-sm sm:text-base tracking-wide ${
                        openIndex === i ? "text-[#2a1206]" : "text-[#4a2a10]"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`ml-4 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openIndex === i
                          ? "bg-[#2a1206] rotate-45"
                          : "bg-[#E4D1B6] rotate-0"
                      }`}
                    >
                      <Plus
                        size={12}
                        className={openIndex === i ? "text-[#EEE3CE]" : "text-[#4a2a10]"}
                      />
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="px-4 sm:px-6 pb-5 text-sm leading-[1.7] text-[#2a1206]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
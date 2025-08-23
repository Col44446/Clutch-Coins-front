import React from "react";
import p1 from "../../assets/p5.svg";
import p2 from "../../assets/p6.svg";
import p3 from "../../assets/p7.svg";
import p4 from "../../assets/p8.svg";
import p5 from "../../assets/p9.jpg";
import p6 from "../../assets/p10.jpg";

const PaymentSlider = () => {
  const payments = [
    { src: p1, alt: "Mastercard Logo" },
    { src: p2, alt: "Visa Logo" },
    { src: p3, alt: "FPX Payment" },
    { src: p4, alt: "Touch n Go eWallet" },
    { src: p5, alt: "PIX Payment" },
    { src: p6, alt: "GrabPay" },
  ];

  return (
    <section
      className="relative overflow-hidden bg-white mb-8 py-4"
      aria-label="Supported payment methods"
    >
      <style>{`
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-slide-left {
          display: flex;
          flex-wrap: nowrap;
        }
        
      `}</style>

      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

      {/* Track container */}
      <div className="animate-slide-left">
        {/* Duplicate list to make infinite loop seamless */}
        {[...payments, ...payments].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-3 sm:mx-4 flex-shrink-0"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="h-6 w-auto sm:h-8 object-contain transition-opacity duration-300 hover:opacity-100 opacity-50"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentSlider;

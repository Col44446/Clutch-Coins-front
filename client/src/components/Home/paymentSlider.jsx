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
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 py-6 rounded-xl shadow-lg border border-gray-700/30"
      aria-label="Supported payment methods"
    >
      {/* Professional header */}
      <div className="text-center mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
          Secure Payment Methods
        </h3>
        <p className="text-gray-300 text-sm">
          We support multiple payment options for your convenience
        </p>
      </div>

      <style>{`
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-slide-left {
          display: flex;
          flex-wrap: nowrap;
          animation: slideLeft 20s linear infinite;
        }
        .animate-slide-left:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>

      {/* Right fade overlay */}
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

      {/* Track container */}
      <div className="animate-slide-left">
        {/* Duplicate list to make infinite loop seamless */}
        {[...payments, ...payments, ...payments].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-3 flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="h-6 w-auto sm:h-8 object-contain transition-all duration-300 hover:scale-110 filter brightness-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Security badges */}
      <div className="flex justify-center items-center mt-4 gap-3 text-gray-300">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Verified Secure</span>
        </div>
      </div>
    </section>
  );
};

export default PaymentSlider;

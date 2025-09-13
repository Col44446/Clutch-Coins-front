import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const coupons = [
    { id: 1, code: "SAVE3", discount: "3% OFF", maxDiscount: "$10" },
    { id: 2, code: "SAVE6", discount: "6% OFF", maxDiscount: "$20" },
    { id: 3, code: "SAVE200", discount: "$200-12", maxDiscount: "$50" },
    { id: 4, code: "SAVE12", discount: "12% OFF", maxDiscount: "$80" },
];

export default function CouponCode() {
    const [hoveredCoupon, setHoveredCoupon] = useState(null);
    const [claimedId, setClaimedId] = useState(null);

    const handleClaim = (id) => {
        setClaimedId(id);
        // Add your claim logic here (e.g., API call)
        setTimeout(() => setClaimedId(null), 1500); // Reset after animation
    };

    return (
        <div className="min-h-[300px] bg-gradient-to-br from-black via-[#040442] to-blue-900 p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
            {/* Cosmic particle background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ left: '10%', top: '20%' }}></div>
                <div className="absolute w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500" style={{ right: '15%', top: '40%' }}></div>
                <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000" style={{ left: '25%', bottom: '30%' }}></div>
            </div>

            <header className="mb-6 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-blue"
                >
                    Galactic Coupon Vault
                </motion.h2>
                <p className="text-sm sm:text-base text-gray-200">
                    Claim cosmic deals up to $80 off – Join the Universe!
                </p>
            </header>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, staggerChildren: 0.2 }}
                >
                    {coupons.map((coupon) => (
                        <motion.div
                            key={coupon.id}
                            className="relative overflow-hidden rounded-lg shadow-lg bg-white border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 w-full max-w-sm mx-auto"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            onMouseEnter={() => setHoveredCoupon(coupon.id)}
                            onMouseLeave={() => setHoveredCoupon(null)}
                        >
                            {/* Coupon Card */}
                            <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-gray-100">
                                {/* Perforated Edges Effect */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 bg-[radial-gradient(circle_at_center,#000_2px,transparent_2px)] bg-[length:10px_10px] bg-repeat-x" />
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 bg-[radial-gradient(circle_at_center,#000_2px,transparent_2px)] bg-[length:10px_10px] bg-repeat-x" />
                                <div className="absolute left-0 top-0 h-full w-2 bg-gray-300 bg-[radial-gradient(circle_at_center,#000_2px,transparent_2px)] bg-[length:10px_10px] bg-repeat-y" />
                                <div className="absolute right-0 top-0 h-full w-2 bg-gray-300 bg-[radial-gradient(circle_at_center,#000_2px,transparent_2px)] bg-[length:10px_10px] bg-repeat-y" />

                                {/* Coupon Content */}
                                <div className="p-6 text-center relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        {/* Coupon Discount */}
                                        <div className="flex justify-center items-center mb-4">
                                            <span className="text-4xl font-extrabold text-blue-600">
                                                {coupon.discount}
                                            </span>
                                            <motion.span
                                                className="ml-3 text-gray-500 cursor-pointer"
                                                whileHover={{ scale: 1.2, rotate: 15 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert(`Max Discount: ${coupon.maxDiscount}\nCode: ${coupon.code}`);
                                                }}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <thern fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" clipRule="evenodd" />
                                                </svg>
                                            </motion.span>
                                        </div>
                                        {/* Coupon Code */}
                                        <p className="text-sm text-gray-600 mb-4">
                                            Code: <span className="font-semibold text-blue-700">{coupon.code}</span>
                                        </p>
                                    </div>

                                    {/* Claim Button */}
                                    <motion.button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold text-base transition-colors duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleClaim(coupon.id)}
                                    >
                                        Claim Now
                                    </motion.button>
                                </div>

                                {/* Back Side for Claim Confirmation */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 text-lg font-bold"
                                    animate={hoveredCoupon === coupon.id ? { rotateY: 180 } : { rotateY: 0 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    Claimed! Code: {coupon.code}
                                </motion.div>
                            </div>

                            {/* Particle Burst Effect on Claim */}
                            <AnimatePresence>
                                {claimedId === coupon.id && (
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 w-0 h-0">
                                            <style>
                                                {`
                .particle {
                  position: absolute;
                  width: 6px;
                  height: 6px;
                  background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
                  animation: particle-burst 0.8s ease-out forwards;
                }
                @keyframes particle-burst {
                  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                  100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
                }
              `}
                                            </style>
                                            {[...Array(15)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="particle"
                                                    style={{
                                                        left: `${50 + Math.random() * 30 - 15}%`,
                                                        top: `${50 + Math.random() * 30 - 15}%`,
                                                        animationDelay: `${i * 0.03}s`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
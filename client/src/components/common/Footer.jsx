import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faReddit, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white py-8 px-4 sm:px-6 md:px-10 shadow-[0_0_15px_rgba(0,255,255,0.2)] animate-pulse-slow">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {/* Company Info Section */}
                <section className="border-l-4 border-blue-800 pl-3" aria-labelledby="company-heading">
                    <h3 id="company-heading" className="text-xl font-bold text-white mb-4">GameTopup</h3>
                    <nav aria-label="Company links">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-cyan-400 transition-colors duration-200">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-cyan-400 transition-colors duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-cyan-400 transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li><a href="/security" className="hover:text-cyan-400 transition-colors duration-200" rel="nofollow">Secure Payments</a></li>
                        </ul>
                    </nav>
                </section>

                {/* Support Section */}
                <section className="border-l-4 border-blue-800 pl-3" aria-labelledby="support-heading">
                    <h3 id="support-heading" className="text-xl font-bold text-white mb-4">Support</h3>
                    <nav aria-label="Support links">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/guide" className="hover:text-cyan-400 transition-colors duration-200">
                                    How to Use
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="hover:text-cyan-400 transition-colors duration-200">
                                    Delivery Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/payments" className="hover:text-cyan-400 transition-colors duration-200">
                                    Payment Options
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="hover:text-cyan-400 transition-colors duration-200">
                                    Return Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-cyan-400 transition-colors duration-200">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </section>

                {/* Contact Section */}
                <section className="border-l-4 border-blue-800 pl-3" aria-labelledby="contact-heading">
                    <h3 id="contact-heading" className="text-xl font-bold text-white mb-4">Contact Us</h3>
                    <nav aria-label="Contact links">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="https://wa.me/1234567890" className="hover:text-cyan-400 flex items-center transition-colors duration-200" rel="nofollow">
                                    <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-cyan-400" aria-hidden="true" /> WhatsApp Support
                                </a>
                            </li>
                            <li><a href="mailto:support@gametopup.com" className="hover:text-cyan-400 transition-colors duration-200">support@gametopup.com</a></li>
                            <li>
                                <a href="https://discord.gg/gametopup" className="hover:text-cyan-400 transition-colors duration-200" rel="nofollow">
                                    Join Our Discord
                                </a>
                            </li>
                        </ul>
                    </nav>
                </section>

                {/* Partnership Section */}
                <section className="border-l-4 border-blue-800 pl-3" aria-labelledby="partnership-heading">
                    <h3 id="partnership-heading" className="text-xl font-bold text-white mb-4">Partnerships</h3>
                    <nav aria-label="Partnership links">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/partner" className="inline-block bg-blue-700 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition-all duration-200" rel="nofollow">
                                    Become a Partner
                                </a>
                            </li>
                            <li><a href="mailto:partners@gametopup.com" className="hover:text-cyan-400 transition-colors duration-200">partners@gametopup.com</a></li>
                        </ul>
                    </nav>
                </section>

                {/* Newsletter & Payments Section */}
                <section className="border-l-4 border-blue-800 pl-3 flex flex-col justify-between" aria-labelledby="newsletter-heading">
                    <div>
                        <h3 id="newsletter-heading" className="text-xl font-bold text-white mb-4">Exclusive Game Offers</h3>
                        <div className="flex mb-4">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full p-2 rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
                                aria-label="Email for newsletter"
                            />
                            <button className="bg-blue-700 text-white p-2 rounded-r-md hover:bg-blue-600 transition-all duration-200" aria-label="Subscribe to newsletter">
                                Join
                            </button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Accepted Payments</h4>
                        <div className="flex flex-wrap gap-2">
                            <img src={p1} alt="PayPal" className="w-7 h-5 object-contain rounded-sm hover:opacity-85 transition-opacity duration-200" loading="lazy" />
                            <img src={p2} alt="Visa" className="w-7 h-5 object-contain rounded-sm hover:opacity-85 transition-opacity duration-200" loading="lazy" />
                            <img src={p3} alt="MasterCard" className="w-7 h-5 object-contain rounded-sm hover:opacity-85 transition-opacity duration-200" loading="lazy" />
                            <img src={p4} alt="Google Pay" className="w-7 h-5 object-contain rounded-sm hover:opacity-85 transition-opacity duration-200" loading="lazy" />
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto text-sm text-gray-300">
                <div className="mb-4 sm:mb-0 flex items-center space-x-4">
                    <span className="font-medium">Connect With Us</span>
                    <div className="flex space-x-3">
                        <a href="https://facebook.com/gametopup" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Follow us on Facebook" rel="nofollow">
                            <FontAwesomeIcon icon={faFacebookF} size="lg" aria-hidden="true" />
                        </a>
                        <a href="https://twitter.com/gametopup" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Follow us on Twitter" rel="nofollow">
                            <FontAwesomeIcon icon={faTwitter} size="lg" aria-hidden="true" />
                        </a>
                        <a href="https://instagram.com/gametopup" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Follow us on Instagram" rel="nofollow">
                            <FontAwesomeIcon icon={faInstagram} size="lg" aria-hidden="true" />
                        </a>
                        <a href="https://reddit.com/r/gametopup" className="hover:text-cyan-400 transition-colors duration-200" aria-label="Follow us on Reddit" rel="nofollow">
                            <FontAwesomeIcon icon={faReddit} size="lg" aria-hidden="true" />
                        </a>
                    </div>
                </div>
                <nav aria-label="Additional links">
                    <div className="flex items-center space-x-4">
                        <a href="https://trustpilot.com/review/gametopup.com" className="hover:text-cyan-400 transition-colors duration-200" rel="nofollow">Rate Us on Trustpilot</a>
                        <a href="mailto:support@gametopup.com" className="hover:text-cyan-400 transition-colors duration-200">Get in Touch</a>
                    </div>
                </nav>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
                © 2025 GameTopup Solutions PTE. LTD. All Rights Reserved. | Your Gaming Recharge Hub!
            </div>
        </footer>
    );
};

// Custom CSS for animation (add to your global CSS file, e.g., index.css)
const styles = `
  @keyframes pulse-slow {
    0% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.2); }
    50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.4); }
    100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.2); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s infinite;
  }
  @media (max-width: 640px) {
    footer {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default Footer;
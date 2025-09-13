import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I purchase in-game currency?",
      answer: "Simply browse our games section, select your game, choose the currency package you want, and complete the secure checkout process. Your currency will be delivered to your game account within minutes."
    },
    {
      id: 2,
      question: "Is it safe to buy currency from ClutchCoins?",
      answer: "Absolutely! We use bank-level security, SSL encryption, and are PCI DSS compliant. All our currency is obtained through legitimate means and we've served thousands of satisfied customers."
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer: "Most orders are delivered within 5-15 minutes. For some games or during peak times, it may take up to 2 hours. You'll receive email updates about your order status."
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), digital wallets (PayPal, Google Pay, Apple Pay), and mobile payments (UPI, Paytm, PhonePe)."
    },
    {
      id: 5,
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Due to the digital nature of our products, refunds are generally not available once currency is delivered. However, we offer refunds for technical issues, duplicate orders, or if the currency wasn't delivered."
    },
    {
      id: 6,
      question: "Do you offer customer support?",
      answer: "Yes! We provide 24/7 customer support through live chat, email (support@clutchcoins.com), and phone. Our average response time is under 2 hours."
    },
    {
      id: 7,
      question: "Which games do you support?",
      answer: "We support popular games including PUBG Mobile, Free Fire, Call of Duty Mobile, Genshin Impact, Roblox, Fortnite, and many more. Check our games section for the full list."
    },
    {
      id: 8,
      question: "Is my personal information secure?",
      answer: "Yes, we take privacy seriously. We use industry-standard encryption, never store payment details, and only collect information necessary to process your orders. Read our Privacy Policy for full details."
    },
    {
      id: 9,
      question: "Can I track my order?",
      answer: "Yes! After placing an order, you'll receive a confirmation email with tracking information. You can also check your order status in your account dashboard."
    },
    {
      id: 10,
      question: "What if I enter wrong game account details?",
      answer: "Please double-check your account details before confirming your order. If you notice an error immediately after ordering, contact our support team right away. We may be able to help if the currency hasn't been delivered yet."
    },
    {
      id: 11,
      question: "Do you offer bulk discounts?",
      answer: "Yes! We offer special pricing for bulk orders and have a partnership program for content creators and gaming communities. Contact our sales team for custom pricing."
    },
    {
      id: 12,
      question: "Can I use ClutchCoins on multiple devices?",
      answer: "Yes, your ClutchCoins account works across all devices. Simply log in with your credentials on any device to access your account and order history."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <HelpCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-300">
            Find answers to common questions about ClutchCoins. Can't find what you're looking for? 
            <a href="/contact" className="text-cyan-400 hover:text-cyan-300 ml-1">Contact our support team</a>.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                {openFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-3">Still Have Questions?</h2>
          <p className="text-gray-300 mb-4">
            Our support team is available 24/7 to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md transition-colors duration-200">
              Start Live Chat
            </button>
            <a 
              href="mailto:support@clutchcoins.com"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors duration-200 inline-block"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

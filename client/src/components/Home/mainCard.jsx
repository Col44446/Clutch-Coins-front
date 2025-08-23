import React, { useState, useEffect } from 'react';
import pic1 from '../../assets/temp-11.jpg'
import pic2 from '../../assets/temp-12.jpg';
import pic3 from '../../assets/temp-13.jpg';
import pic4 from '../../assets/temp-14.jpg';
import pic5 from '../../assets/temp-15.jpg';
import pic6 from '../../assets/temp-16.jpg';
import pic7 from '../../assets/temp-17.jpg';


function MainCard() {
  const images = [
    { src: pic1, alt: 'Red themed placeholder image' },
    { src: pic2, alt: 'Green themed placeholder image' },
    { src: pic3, alt: 'Blue themed placeholder image' },
    { src: pic4, alt: 'Yellow themed placeholder image' },
    { src: pic5, alt: 'Purple themed placeholder image' },
    { src: pic6, alt: 'Orange themed placeholder image' },
    { src: pic7, alt: 'Pink themed placeholder image' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white px-2 sm:px-4">
      {/* Carousel container */}
      <div className="mt-20 sm:mt-40 relative w-full max-w-7xl h-56 sm:h-96 overflow-hidden rounded-xl sm:rounded-3xl">
        {images.map((img, index) => {
          let position = 'translate-x-full opacity-0'; // default hidden right
          if (index === currentIndex) {
            position = 'translate-x-0 opacity-100'; // active
          } else if (index === (currentIndex - 1 + images.length) % images.length) {
            position = '-translate-x-full opacity-0'; // gone left
          }

          return (
            <img
              key={index}
              src={img.src}
              alt={img.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/30 transform transition-all duration-700 ease-in-out ${position}`}
            />
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="flex space-x-2 mt-4 sm:mt-6">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-sky-400 w-6 sm:w-8' : 'bg-gray-500 w-3 sm:w-4'
              }`}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default MainCard;

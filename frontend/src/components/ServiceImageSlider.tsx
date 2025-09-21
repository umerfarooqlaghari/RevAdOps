'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

interface ServiceImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

interface ServiceImageSliderProps {
  images: ServiceImage[];
  serviceName: string;
}

export default function ServiceImageSlider({ images, serviceName }: ServiceImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prevIndex) => 
      prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevModalImage = () => {
    setModalImageIndex((prevIndex) => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };

  if (sortedImages.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {serviceName} Gallery
            </h2>
            <p className="text-xl text-gray-600">
              Explore our work and see the results we deliver
            </p>
          </div>

          {/* Main Image Display */}
          <div className="relative mb-8">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={sortedImages[currentIndex].url}
                alt={sortedImages[currentIndex].alt || `${serviceName} image ${currentIndex + 1}`}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openModal(currentIndex)}
              />
              
              {/* Navigation Arrows */}
              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {sortedImages.length}
              </div>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {sortedImages.length > 1 && (
            <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${serviceName} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Full-Size Images */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Modal Image */}
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={sortedImages[modalImageIndex].url}
                alt={sortedImages[modalImageIndex].alt || `${serviceName} image ${modalImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Modal Navigation */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextModalImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Modal Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {modalImageIndex + 1} / {sortedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

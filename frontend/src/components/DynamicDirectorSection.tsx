'use client';

import React from 'react';
import Image from 'next/image';

interface DirectorProps {
  content: Record<string, string>;
}

export default function DynamicDirectorSection({ content }: DirectorProps) {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Director Photo */}
        <div className="mb-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={content.photo || '/placeholder-director.jpg'}
              alt={content.name || 'Director'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 25vw"
            />
          </div>
        </div>

        {/* Director Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {content.name || 'Silvia'}
          </h3>
          <p className="text-lg text-blue-600 font-semibold mb-4">
            {content.title || 'Director of RevAdOps'}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {content.brief || 'Dedicated to Ad Operations for Publishers in Digital Media since 2013'}
          </p>
        </div>

        {/* Key Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Experience</span>
              <span className="text-sm font-semibold text-gray-900">
                {content.experience || '9000+ hours'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Clients Served</span>
              <span className="text-sm font-semibold text-gray-900">
                {content.clients || '130+ global clients'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Specialization</span>
              <span className="text-sm font-semibold text-gray-900 text-right">
                {content.specialization || 'GAM & Programmatic'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

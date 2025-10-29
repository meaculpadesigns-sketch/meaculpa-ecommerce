'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CarnivalsPage() {
  const { t } = useTranslation();
  const carnivals = [
    {
      id: '1',
      name: t('carnivals.event1Name'),
      date: t('carnivals.event1Date'),
      location: t('carnivals.event1Location'),
      description: t('carnivals.event1Desc'),
      image: '/images/carnival-1.jpg',
      status: 'upcoming',
    },
    {
      id: '2',
      name: t('carnivals.event2Name'),
      date: t('carnivals.event2Date'),
      location: t('carnivals.event2Location'),
      description: t('carnivals.event2Desc'),
      image: '/images/carnival-2.jpg',
      status: 'upcoming',
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('carnivals.title')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('carnivals.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {carnivals.map((carnival, index) => (
            <motion.div
              key={carnival.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                <p className="text-white">{t('carnivals.eventImage')}</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold text-sm font-medium">
                    {carnival.status === 'upcoming' ? t('carnivals.upcoming') : t('carnivals.past')}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {carnival.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={18} />
                    <span>{carnival.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={18} />
                    <span>{carnival.location}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  {carnival.description}
                </p>

                <button className="btn-primary w-full">
                  {t('carnivals.viewDetails')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {carnivals.length === 0 && (
          <div className="text-center py-20">
            <Users className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('carnivals.noEvents')}
            </h2>
            <p className="text-gray-400">
              {t('carnivals.noEventsDesc')}
            </p>
          </div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {t('carnivals.stayUpdatedTitle')}
          </h3>
          <p className="text-gray-300 mb-6">
            {t('carnivals.stayUpdatedDesc')}
          </p>
          <a
            href="https://www.instagram.com/meaculpadesigns"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            {t('carnivals.followInstagram')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

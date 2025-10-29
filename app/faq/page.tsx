'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQPage() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      categoryKey: 'orderDelivery',
      questions: [
        {
          qKey: 'q1',
          aKey: 'a1',
        },
        {
          qKey: 'q2',
          aKey: 'a2',
        },
        {
          qKey: 'q3',
          aKey: 'a3',
        },
        {
          qKey: 'q4',
          aKey: 'a4',
        },
      ],
    },
    {
      categoryKey: 'productSize',
      questions: [
        {
          qKey: 'q5',
          aKey: 'a5',
        },
        {
          qKey: 'q6',
          aKey: 'a6',
        },
        {
          qKey: 'q7',
          aKey: 'a7',
        },
        {
          qKey: 'q8',
          aKey: 'a8',
        },
      ],
    },
    {
      categoryKey: 'returnExchange',
      questions: [
        {
          qKey: 'q9',
          aKey: 'a9',
        },
        {
          qKey: 'q10',
          aKey: 'a10',
        },
        {
          qKey: 'q11',
          aKey: 'a11',
        },
        {
          qKey: 'q12',
          aKey: 'a12',
        },
      ],
    },
    {
      categoryKey: 'payment',
      questions: [
        {
          qKey: 'q13',
          aKey: 'a13',
        },
        {
          qKey: 'q14',
          aKey: 'a14',
        },
        {
          qKey: 'q15',
          aKey: 'a15',
        },
      ],
    },
    {
      categoryKey: 'customDesign',
      questions: [
        {
          qKey: 'q16',
          aKey: 'a16',
        },
        {
          qKey: 'q17',
          aKey: 'a17',
        },
        {
          qKey: 'q18',
          aKey: 'a18',
        },
      ],
    },
    {
      categoryKey: 'account',
      questions: [
        {
          qKey: 'q19',
          aKey: 'a19',
        },
        {
          qKey: 'q20',
          aKey: 'a20',
        },
        {
          qKey: 'q21',
          aKey: 'a21',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{t(`faq.${category.categoryKey}`)}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openIndex === index;

                  return (
                    <div key={qIndex} className="glass rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white hover:bg-opacity-5 transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{t(`faq.${faq.qKey}`)}</span>
                        <ChevronDown
                          className={`text-mea-gold flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          size={24}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                              {t(`faq.${faq.aKey}`)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {t('faq.noAnswer')}
          </h3>
          <p className="text-gray-400 mb-6">
            {t('faq.noAnswerDesc')}
          </p>
          <a href="/contact" className="btn-primary inline-block">
            {t('faq.contactUs')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

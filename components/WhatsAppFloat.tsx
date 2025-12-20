'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const phoneNumber = '+905075620802';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        WhatsApp ile iletişime geç
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </a>
  );
}

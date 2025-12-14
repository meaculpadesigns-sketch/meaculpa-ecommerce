'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminBackButton() {
  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-black dark:text-white rounded-lg transition-colors mb-6"
    >
      <ArrowLeft size={20} />
      <span>Admin Paneline Dön</span>
    </Link>
  );
}

// Standart Beden Tabloları

export interface SizeChartRow {
  beden: string;
  // For sets (pijama, gomlek, krop)
  pijamaBoyu?: string;
  gomlekBoyu?: string;
  kolBoyu?: string;
  // For kimonos
  kimonoBoyu?: string;
}

export interface SizeChart {
  id: string;
  name: string;
  nameEn: string;
  category: 'set' | 'kimono';
  subCategory?: 'kadin' | 'erkek' | 'krop' | 'uzun' | 'kisa';
  rows: SizeChartRow[];
  createdAt: Date;
  isStandard?: boolean;
  standardId?: string;
}

// Kadın Set Beden Tablosu
export const KADIN_SET_SIZE_CHART: Omit<SizeChart, 'id' | 'createdAt'> = {
  name: 'Kadın Set Beden Tablosu',
  nameEn: 'Women Set Size Chart',
  category: 'set',
  subCategory: 'kadin',
  rows: [
    { beden: 'S', pijamaBoyu: '95cm', gomlekBoyu: '60cm', kolBoyu: '35cm' },
    { beden: 'M', pijamaBoyu: '100cm', gomlekBoyu: '65cm', kolBoyu: '35cm' },
    { beden: 'L', pijamaBoyu: '105cm', gomlekBoyu: '70cm', kolBoyu: '35cm' },
    { beden: 'XL', pijamaBoyu: '110cm', gomlekBoyu: '75cm', kolBoyu: '35cm' },
  ],
};

// Erkek Set Beden Tablosu
export const ERKEK_SET_SIZE_CHART: Omit<SizeChart, 'id' | 'createdAt'> = {
  name: 'Erkek Set Beden Tablosu',
  nameEn: 'Men Set Size Chart',
  category: 'set',
  subCategory: 'erkek',
  rows: [
    { beden: 'S', pijamaBoyu: '100cm', gomlekBoyu: '65cm', kolBoyu: '35cm' },
    { beden: 'M', pijamaBoyu: '105cm', gomlekBoyu: '70cm', kolBoyu: '35cm' },
    { beden: 'L', pijamaBoyu: '110cm', gomlekBoyu: '75cm', kolBoyu: '35cm' },
    { beden: 'XL', pijamaBoyu: '115cm', gomlekBoyu: '80cm', kolBoyu: '35cm' },
  ],
};

// Krop Gömlek Beden Tablosu
export const KROP_GOMLEK_SIZE_CHART: Omit<SizeChart, 'id' | 'createdAt'> = {
  name: 'Krop Gömlek Beden Tablosu',
  nameEn: 'Crop Shirt Size Chart',
  category: 'set',
  subCategory: 'krop',
  rows: [
    { beden: 'S', gomlekBoyu: '40cm', kolBoyu: '35cm' },
    { beden: 'M', gomlekBoyu: '45cm', kolBoyu: '35cm' },
    { beden: 'L', gomlekBoyu: '50cm', kolBoyu: '35cm' },
    { beden: 'XL', gomlekBoyu: '55cm', kolBoyu: '35cm' },
  ],
};

// Uzun Kimono Beden Tablosu
export const UZUN_KIMONO_SIZE_CHART: Omit<SizeChart, 'id' | 'createdAt'> = {
  name: 'Uzun Kimono Beden Tablosu',
  nameEn: 'Long Kimono Size Chart',
  category: 'kimono',
  subCategory: 'uzun',
  rows: [
    { beden: 'S', kimonoBoyu: '115cm', kolBoyu: '35cm' },
    { beden: 'M', kimonoBoyu: '120cm', kolBoyu: '35cm' },
    { beden: 'L', kimonoBoyu: '125cm', kolBoyu: '35cm' },
    { beden: 'XL', kimonoBoyu: '130cm', kolBoyu: '35cm' },
  ],
};

// Kısa Kimono Beden Tablosu
export const KISA_KIMONO_SIZE_CHART: Omit<SizeChart, 'id' | 'createdAt'> = {
  name: 'Kısa Kimono Beden Tablosu',
  nameEn: 'Short Kimono Size Chart',
  category: 'kimono',
  subCategory: 'kisa',
  rows: [
    { beden: 'S', kimonoBoyu: '70cm', kolBoyu: '35cm' },
    { beden: 'M', kimonoBoyu: '75cm', kolBoyu: '35cm' },
    { beden: 'L', kimonoBoyu: '80cm', kolBoyu: '35cm' },
    { beden: 'XL', kimonoBoyu: '85cm', kolBoyu: '35cm' },
  ],
};

export const STANDARD_SIZE_CHARTS = [
  KADIN_SET_SIZE_CHART,
  ERKEK_SET_SIZE_CHART,
  KROP_GOMLEK_SIZE_CHART,
  UZUN_KIMONO_SIZE_CHART,
  KISA_KIMONO_SIZE_CHART,
];

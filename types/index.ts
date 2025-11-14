export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  priceUSD?: number;
  priceEUR?: number;
  oldPrice?: number;
  category: 'kimono' | 'set';
  subcategory?:
    // Kimono subcategories
    | 'organic-handpainted'  // Organik & El Boyaması
    | 'shiny-sequined'       // Parlak & Pullu Tasarımlar
    | 'recycled-upcycled'    // Geri Dönüşüm & Atık Kumaş
    | 'family-kimono'        // Aile Setleri (Kimono)
    // Set subcategories
    | 'retro-collection'     // Retro Kreasyon
    | 'festival-line'        // Festival Kreasyon
    | 'one-only-collection'  // Kısıtlı Üretim Kreasyon
    | 'special-fabric'       // Özel Tasarım Kumaş Setleri
    | 'handpainted-linen'    // El Boyaması Keten Setler
    | 'family-sets'          // Aile Setleri
    | 'kids-collection';     // Çocuk Setleri
  collection?: string; // New: for grouping products into collections
  images: string[];
  fabricImage?: string;
  description: string;
  descriptionEn: string;
  story?: string;
  storyEn?: string;
  sizes: Size[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
}

export interface Size {
  size: string;
  inStock: boolean;
  preOrder: boolean;
}

export interface Creation {
  id: string;
  name: string;
  title?: string; // For backwards compatibility
  titleEn?: string; // For backwards compatibility
  description: string;
  descriptionEn?: string;
  story: string;
  storyEn?: string;
  season: 'summer' | 'winter' | 'special' | 'all';
  products: string[]; // Product IDs
  image: string;
  featured: boolean;
  order?: number;
  active?: boolean;
  createdAt?: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
  favorites: string[]; // Product IDs
  addresses: Address[];
  coupons: Coupon[];
}

export interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: string;
  quantity: number;
  specialRequests?: string;
  giftWrapping: boolean;
  giftMessage?: string;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'crypto' | 'googlepay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  guestEmail?: string;
  guestPhone?: string;
}

export interface DesignRequest {
  id: string;
  requestNumber: string;
  userId?: string;
  type: 'text' | 'image';
  description?: string;
  images?: string[];
  status: 'pending' | 'in-review' | 'approved' | 'in-production' | 'completed' | 'rejected';
  guestEmail?: string;
  guestPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  adminNotes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount: number;
  userSpecific?: string; // User ID
  active: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  type: 'contact' | 'live-chat' | 'design-request';
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: Date;
  status?: 'pending' | 'approved' | 'rejected';
  isVisible?: boolean;
}

export interface Story {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  title: string;
  story: string;
  images?: string[];
  approved: boolean;
  createdAt: Date;
}

export interface SiteSettings {
  id: string;
  welcomeMessage: string;
  welcomeMessageEn: string;
  showWelcomeMessage: boolean;
  maintenanceMode: boolean;
  seoKeywords: string[];
  socialMedia: {
    instagram: string;
    facebook?: string;
    twitter?: string;
    pinterest?: string;
  };
}

export interface AnalyticsData {
  productViews: Record<string, number>;
  categoryViews: Record<string, number>;
  userBehavior: {
    averageSessionTime: number;
    bounceRate: number;
    conversionRate: number;
  };
  topProducts: Array<{
    productId: string;
    views: number;
    sales: number;
  }>;
}

export interface Collection {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image?: string;
  products: string[]; // Product IDs
  active: boolean;
  featured: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInfo {
  key: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  slogan?: string;
  sloganEn?: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
}

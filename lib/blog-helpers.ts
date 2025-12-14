import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost, BlogCategory, BlogComment } from '@/types';
import slugify from 'slugify';

// Slug generation
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'tr',
  });
}

// Calculate read time (words per minute = 200)
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Blog Posts
export async function getAllBlogPosts() {
  const postsRef = collection(db, 'blogs');
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
      publishedAt: data.publishedAt?.toDate?.() || null,
      scheduledFor: data.scheduledFor?.toDate?.() || null,
    } as BlogPost;
  });
}

export async function getPublishedBlogPosts() {
  const postsRef = collection(db, 'blogs');
  const q = query(
    postsRef,
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
        publishedAt: data.publishedAt?.toDate?.() || null,
        scheduledFor: data.scheduledFor?.toDate?.() || null,
      } as BlogPost;
    })
    .filter((post) => post.status === 'published');
  return posts;
}

export async function getBlogPostBySlug(slug: string) {
  const postsRef = collection(db, 'blogs');
  const q = query(postsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
      publishedAt: data.publishedAt?.toDate?.() || null,
      scheduledFor: data.scheduledFor?.toDate?.() || null,
    } as BlogPost;
  }
  return null;
}

export async function getBlogPostById(id: string) {
  const postRef = doc(db, 'blogs', id);
  const snapshot = await getDoc(postRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
      publishedAt: data.publishedAt?.toDate?.() || null,
      scheduledFor: data.scheduledFor?.toDate?.() || null,
    } as BlogPost;
  }
  return null;
}

export async function getBlogPostsByCategory(categoryId: string) {
  const postsRef = collection(db, 'blogs');
  const q = query(
    postsRef,
    where('categoryId', '==', categoryId),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const now = new Date();
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
        publishedAt: data.publishedAt?.toDate?.() || null,
        scheduledFor: data.scheduledFor?.toDate?.() || null,
      } as BlogPost;
    })
    .filter(
      (post) =>
        post.status === 'published' &&
        (!post.scheduledFor || post.scheduledFor <= now)
    );
}

export async function getBlogPostsByTag(tag: string) {
  const postsRef = collection(db, 'blogs');
  const q = query(
    postsRef,
    where('tags', 'array-contains', tag),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const now = new Date();
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
        publishedAt: data.publishedAt?.toDate?.() || null,
        scheduledFor: data.scheduledFor?.toDate?.() || null,
      } as BlogPost;
    })
    .filter(
      (post) =>
        post.status === 'published' &&
        (!post.scheduledFor || post.scheduledFor <= now)
    );
}

export async function addBlogPost(post: Omit<BlogPost, 'id'>) {
  const postsRef = collection(db, 'blogs');
  const docRef = await addDoc(postsRef, {
    ...post,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    views: 0,
    publishedAt: post.status === 'published' ? Timestamp.now() : null,
    scheduledFor: post.scheduledFor ? Timestamp.fromDate(post.scheduledFor as any) : null,
  });
  return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  const postRef = doc(db, 'blogs', id);
  const updateData: any = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  // If status changes to published and publishedAt is not set
  if (data.status === 'published' && !data.publishedAt) {
    updateData.publishedAt = Timestamp.now();
  }

  // Handle scheduledFor date conversion
  if (data.scheduledFor) {
    updateData.scheduledFor = Timestamp.fromDate(data.scheduledFor as any);
  }

  await updateDoc(postRef, updateData);
}

export async function deleteBlogPost(id: string) {
  const postRef = doc(db, 'blogs', id);
  await deleteDoc(postRef);
}

export async function incrementBlogPostViews(id: string) {
  const postRef = doc(db, 'blogs', id);
  await updateDoc(postRef, {
    views: increment(1),
  });
}

// Blog Categories
export async function getAllBlogCategories() {
  const categoriesRef = collection(db, 'blogCategories');
  const q = query(categoriesRef, orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    } as BlogCategory;
  });
}

export async function getBlogCategoryBySlug(slug: string) {
  const categoriesRef = collection(db, 'blogCategories');
  const q = query(categoriesRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    } as BlogCategory;
  }
  return null;
}

export async function getBlogCategoryById(id: string) {
  const categoryRef = doc(db, 'blogCategories', id);
  const snapshot = await getDoc(categoryRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    } as BlogCategory;
  }
  return null;
}

export async function addBlogCategory(category: Omit<BlogCategory, 'id'>) {
  const categoriesRef = collection(db, 'blogCategories');
  const docRef = await addDoc(categoriesRef, {
    ...category,
    createdAt: Timestamp.now(),
    postCount: 0,
  });
  return docRef.id;
}

export async function updateBlogCategory(id: string, data: Partial<BlogCategory>) {
  const categoryRef = doc(db, 'blogCategories', id);
  await updateDoc(categoryRef, data);
}

export async function deleteBlogCategory(id: string) {
  const categoryRef = doc(db, 'blogCategories', id);
  await deleteDoc(categoryRef);
}

export async function updateCategoryPostCount(categoryId: string) {
  const postsRef = collection(db, 'blogs');
  const q = query(
    postsRef,
    where('categoryId', '==', categoryId),
    where('status', '==', 'published')
  );
  const snapshot = await getDocs(q);
  const count = snapshot.size;

  const categoryRef = doc(db, 'blogCategories', categoryId);
  await updateDoc(categoryRef, { postCount: count });
}

// Blog Comments
export async function getAllBlogComments() {
  const commentsRef = collection(db, 'blogComments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || null,
    } as BlogComment;
  });
}

export async function getPendingComments() {
  const commentsRef = collection(db, 'blogComments');
  const q = query(
    commentsRef,
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || null,
    } as BlogComment;
  });
}

export async function getApprovedCommentsByPost(postId: string) {
  const commentsRef = collection(db, 'blogComments');
  const q = query(
    commentsRef,
    where('postId', '==', postId),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || null,
    } as BlogComment;
  });
}

export async function addBlogComment(comment: Omit<BlogComment, 'id'>) {
  const commentsRef = collection(db, 'blogComments');
  const docRef = await addDoc(commentsRef, {
    ...comment,
    status: 'pending',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateBlogComment(id: string, data: Partial<BlogComment>) {
  const commentRef = doc(db, 'blogComments', id);
  await updateDoc(commentRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteBlogComment(id: string) {
  const commentRef = doc(db, 'blogComments', id);
  await deleteDoc(commentRef);
}

export async function approveBlogComment(id: string) {
  const commentRef = doc(db, 'blogComments', id);
  await updateDoc(commentRef, {
    status: 'approved',
    updatedAt: Timestamp.now(),
  });
}

export async function rejectBlogComment(id: string) {
  const commentRef = doc(db, 'blogComments', id);
  await updateDoc(commentRef, {
    status: 'rejected',
    updatedAt: Timestamp.now(),
  });
}

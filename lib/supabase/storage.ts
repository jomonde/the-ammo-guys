import { StorageClient } from '@supabase/storage-js';
import { supabase } from './client';

// Get storage client with public access
const getPublicStorage = () => {
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'public';
  return supabase.storage.from(bucketName);
};

// Get storage client with private access
const getPrivateStorage = () => {
  const bucketName = process.env.NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET || 'private';
  return supabase.storage.from(bucketName);
};

// Upload a file to public storage
export const uploadPublicFile = async (path: string, file: File) => {
  const storage = getPublicStorage();
  const { data, error } = await storage.upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  
  if (error) throw error;
  return storage.getPublicUrl(path);
};

// Upload a file to private storage
export const uploadPrivateFile = async (path: string, file: File) => {
  const storage = getPrivateStorage();
  const { data, error } = await storage.upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  
  if (error) throw error;
  return path; // Return the path as the URL will be generated with getSignedUrl
};

// Get public URL for a file in public storage
export const getPublicUrl = (path: string) => {
  const storage = getPublicStorage();
  return storage.getPublicUrl(path);
};

// Get signed URL for a file in private storage (expires in 1 hour by default)
export const getSignedUrl = async (path: string, expiresIn = 3600) => {
  const storage = getPrivateStorage();
  const { data, error } = await storage.createSignedUrl(path, expiresIn);
  
  if (error) throw error;
  return data.signedUrl;
};

// Example usage:
/*
// Upload to public storage
const { publicURL } = await uploadPublicFile('avatars/user1.jpg', file);

// Upload to private storage
const filePath = await uploadPrivateFile('documents/confidential.pdf', file);
const signedUrl = await getSignedUrl(filePath);
*/

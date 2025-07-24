import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Service Role Key in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupStoragePolicies() {
  try {
    // Create the public bucket if it doesn't exist
    const { data: publicBucket, error: publicBucketError } = await supabase.storage
      .createBucket('default-public', { public: true });

    if (publicBucketError && publicBucketError.message !== 'Bucket already exists') {
      throw publicBucketError;
    }

    // Create the private bucket if it doesn't exist
    const { data: privateBucket, error: privateBucketError } = await supabase.storage
      .createBucket('default-private', { public: false });

    if (privateBucketError && privateBucketError.message !== 'Bucket already exists') {
      throw privateBucketError;
    }

    console.log('✅ Storage buckets created/verified');
    
    // Set bucket policies using SQL (this requires the service role key)
    const { data: policies, error: policyError } = await supabase.rpc('set_storage_policies');
    
    if (policyError) {
      console.error('Error setting storage policies:', policyError);
      return;
    }

    console.log('✅ Storage policies set up successfully');
  } catch (error) {
    console.error('❌ Error setting up storage:', error);
  }
}

// Run the setup
setupStoragePolicies();

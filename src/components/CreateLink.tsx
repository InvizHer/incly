import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface CreateLinkProps {
  onLinkCreated: () => void;
}

export default function CreateLink({ onLinkCreated }: CreateLinkProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const original_url = formData.get('original_url') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.from('links').insert([
        {
          user_id: user?.id,
          name,
          original_url,
          thumbnail_url: thumbnail_url || null,
          password: password || null,
        },
      ]);

      if (error) throw error;

      toast.success('Link created successfully!');
      onLinkCreated();
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Link Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="original_url"
            className="block text-sm font-medium text-gray-700"
          >
            Original URL
          </label>
          <input
            type="url"
            name="original_url"
            id="original_url"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="thumbnail_url"
            className="block text-sm font-medium text-gray-700"
          >
            Thumbnail URL (optional)
          </label>
          <input
            type="url"
            name="thumbnail_url"
            id="thumbnail_url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password Protection (optional)
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Link'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
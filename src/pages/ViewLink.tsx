import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Lock, ExternalLink, Eye } from 'lucide-react';

export default function ViewLink() {
  const { token } = useParams<{ token: string }>();
  const [link, setLink] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  useEffect(() => {
    fetchLink();
  }, [token]);

  const fetchLink = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('token', token)
        .single();

      if (error) throw error;

      setLink(data);
      if (!data.password) {
        incrementViews();
        setIsPasswordCorrect(true);
      }
    } catch (error: any) {
      setError('Link not found');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase
        .from('links')
        .update({ views: (link?.views || 0) + 1 })
        .eq('token', token);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === link.password) {
      setIsPasswordCorrect(true);
      incrementViews();
    } else {
      toast.error('Incorrect password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error}
          </h2>
          <p className="text-gray-600">
            The link you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <LinkIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            SecureLink
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-gray-900">{link.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="w-4 h-4 mr-1" />
                {link.views} views
              </div>
            </div>

            {link.thumbnail_url && (
              <img
                src={link.thumbnail_url}
                alt={link.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            {!isPasswordCorrect ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Lock className="w-4 h-4 mr-2" />
                  This link is password protected
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter password to access the link
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Access Link
                </button>
              </form>
            ) : (
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Original URL
                </div>
                <a
                  href={link.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Visit Link
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
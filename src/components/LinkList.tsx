import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Lock,
  Unlock,
} from 'lucide-react';

interface Link {
  id: string;
  name: string;
  original_url: string;
  thumbnail_url: string | null;
  password: string | null;
  token: string;
  views: number;
  created_at: string;
  updated_at: string;
}

interface LinkListProps {
  links: Link[];
  onLinksChange: () => void;
}

export default function LinkList({ links, onLinksChange }: LinkListProps) {
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const { error } = await supabase.from('links').delete().eq('id', id);

      if (error) throw error;

      toast.success('Link deleted successfully');
      onLinksChange();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLink) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name'),
      original_url: formData.get('original_url'),
      thumbnail_url: formData.get('thumbnail_url') || null,
      password: formData.get('password') || null,
    };

    try {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', editingLink.id);

      if (error) throw error;

      toast.success('Link updated successfully');
      setEditingLink(null);
      onLinksChange();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getShareableLink = (token: string) => {
    return `${window.location.origin}/view/${token}`;
  };

  return (
    <div className="space-y-6">
      {links.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No links found. Create your first link!</p>
        </div>
      ) : (
        links.map((link) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {editingLink?.id === link.id ? (
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={link.name}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Original URL
                  </label>
                  <input
                    type="url"
                    name="original_url"
                    defaultValue={link.original_url}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail_url"
                    defaultValue={link.thumbnail_url || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave empty to keep current password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLink(null)}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {link.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-600 truncate"
                      >
                        {link.original_url}
                      </a>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(link.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-2" />
                      {link.views} views
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      {link.password ? (
                        <Lock className="w-4 h-4 mr-2" />
                      ) : (
                        <Unlock className="w-4 h-4 mr-2" />
                      )}
                      {link.password ? 'Password protected' : 'No password'}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Shareable Link
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      readOnly
                      value={getShareableLink(link.token)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(getShareableLink(link.token));
                        toast.success('Link copied to clipboard!');
                      }}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Shield, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">SecureLink</span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:text-indigo-100 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <h1 className="text-6xl font-bold mb-6">
            Secure Link Sharing Made Simple
          </h1>
          <p className="text-xl mb-12 text-indigo-100">
            Store, protect, and share your links with confidence
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-lg"
            >
              <Shield className="w-12 h-12 mb-4 mx-auto text-white" />
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-indigo-100">
                Protect your links with optional password protection
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-lg"
            >
              <Share2 className="w-12 h-12 mb-4 mx-auto text-white" />
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-indigo-100">
                Generate shareable links with custom thumbnails
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-lg"
            >
              <LinkIcon className="w-12 h-12 mb-4 mx-auto text-white" />
              <h3 className="text-xl font-semibold mb-2">Link Management</h3>
              <p className="text-indigo-100">
                Organize and track your links with ease
              </p>
            </motion.div>
          </div>

          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  LinkIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ShareModal = ({ isOpen, onClose, trip }) => {
  const [shareData, setShareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen && trip) {
      generateShareLink();
    }
  }, [isOpen, trip]);

  useEffect(() => {
    if (shareData) {
      generateQRCode();
    }
  }, [shareData]);

  const generateShareLink = async () => {
    try {
      setLoading(true);
      const response = await api.generateShareLink(trip._id);
      setShareData(response);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const QRCode = await import('qrcode');
      const qrDataUrl = await QRCode.toDataURL(shareData.shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Background overlay with blur */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Share Trip</h3>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{trip.name}</h4>
                  <p className="text-sm text-gray-600">{trip.description}</p>
                </div>

                {shareData && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={shareData.shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <Button onClick={copyToClipboard} className="rounded-l-none border-l-0" size="sm">
                        {copySuccess ? (
                          <>
                            <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {qrCode && (
                  <div className="mb-6 text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
                    <div className="inline-block p-4 bg-gray-50 rounded-lg">
                      <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Scan to share instantly</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
            <div className="flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShareModal;

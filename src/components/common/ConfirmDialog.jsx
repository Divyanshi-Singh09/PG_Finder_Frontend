import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            variant={danger ? 'danger' : 'primary'} 
            size="sm" 
            onClick={onConfirm} 
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {danger && (
          <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        )}
        <p className="text-sm text-slate-600 leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </Modal>
  );
}

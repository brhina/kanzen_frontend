import { AnimatePresence, motion } from 'motion/react';
import { Toast } from './Toast';
import { useToastStore } from './toast.store';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-3 p-4 sm:p-6"
    >
      <div className="flex w-full flex-col items-end gap-2.5">
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Toast toast={item} onDismiss={removeToast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

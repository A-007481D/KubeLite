import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
};

const styles = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-amber-500/30 bg-amber-500/10',
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md min-w-[280px] max-w-[360px] ${styles[toast.type]}`}
        >
            {icons[toast.type]}
            <span className="text-xs text-[#E3E3E3] flex-1">{toast.message}</span>
            <button onClick={() => onClose(toast.id)} className="text-[#555] hover:text-[#AAA] transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
            <AnimatePresence mode="popLayout">
                {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={onClose} />)}
            </AnimatePresence>
        </div>
    );
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
}

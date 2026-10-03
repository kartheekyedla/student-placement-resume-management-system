// client/src/components/Loader.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...', size = 'default', fullScreen = false }) => {
  const spinnerSize = size === 'large' ? 'w-10 h-10' : size === 'small' ? 'w-4 h-4' : 'w-6 h-6';

  const content = (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <Loader2 className={`${spinnerSize} text-indigo-500 animate-spin`} />
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;

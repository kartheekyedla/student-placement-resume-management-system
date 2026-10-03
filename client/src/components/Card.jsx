// client/src/components/Card.jsx
import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  hover = false,
  badge,
  icon: Icon
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-200 ${
        hover ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {(title || subtitle || action || Icon || badge) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
                  {badge && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {badge}
                    </span>
                  )}
                </div>
              )}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

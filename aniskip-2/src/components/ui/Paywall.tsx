import React from 'react';
import { Star } from 'lucide-react';

interface PaywallProps {
  title: string;
  description: string;
  features: string[];
  className?: string;
  children?: React.ReactNode;
}

// Replace the Paywall component logic to show free content instead of locked features.
const Paywall: React.FC<PaywallProps> = ({ title, description, features, className = '', children }) => {
  return (
    <div className={`bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{title} - Included in Free Version!</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <ul className="space-y-2 text-sm text-gray-300">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Paywall;

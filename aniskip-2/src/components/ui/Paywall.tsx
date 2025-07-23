import React from 'react';
import { Star } from 'lucide-react';

interface PaywallProps {
  title: string;
  description: string;
  features: string[];
  className?: string;
  children?: React.ReactNode;
}

// Now shows free content instead of paywall
const Paywall: React.FC<PaywallProps> = ({ title, description, features, className = '', children }) => {
  return (
    <div className={`bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-4">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
            <Star className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title} - Now FREE!</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-green-300 mb-3">Free features included:</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 text-xs text-green-400 font-medium">
          🎉 All features are now free for everyone!
        </div>
      </div>
      
      {/* Show actual content instead of blurred version */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Paywall;

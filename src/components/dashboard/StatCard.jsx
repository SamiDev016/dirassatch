import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, bgColor = 'bg-blue-50', iconColor = 'text-blue-500' }) {
  const isTrendUp = trend === 'up';
  
  return (
    <div className={`p-6 rounded-2xl shadow-sm ${bgColor} border border-gray-100`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconColor} bg-white/80 shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trendValue && (
        <div className="flex items-center">
          {isTrendUp ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-xs font-medium ${isTrendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendValue}% {isTrendUp ? 'increase' : 'decrease'}
          </span>
          <span className="text-xs text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
}
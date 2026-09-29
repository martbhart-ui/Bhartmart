import React from 'react';
import { Check, Circle } from 'lucide-react';

interface OrderTimelineProps {
  status: string;
  createdAt: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, createdAt }) => {
  const dateObj = new Date(createdAt || Date.now());
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });

  const stages = [
    {
      key: 'Confirmed',
      title: `Order Confirmed ${formattedDate}`,
      subItems: [
        'Your Order has been placed.',
        'Seller has processed your order.',
        'Your item has been picked up by delivery partner.',
      ],
    },
    {
      key: 'Shipped',
      title: 'Shipped',
      subItems: [
        'Your item has been shipped.',
        'Shipment is in mid mile hub nearest to you.',
      ],
    },
    {
      key: 'Out For Delivery',
      title: 'Out For Delivery',
      subItems: ['Your item is out for delivery with courier executive.'],
    },
    {
      key: 'Delivered',
      title: 'Delivered',
      subItems: ['Your package has been successfully delivered.'],
    },
  ];

  const getStageIndex = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'delivered':
        return 3;
      case 'out for delivery':
        return 2;
      case 'shipped':
        return 1;
      case 'confirmed':
      case 'pending':
      default:
        return 0;
    }
  };

  const currentIdx = getStageIndex(status);

  return (
    <div className="py-4 px-2 sm:px-4 bg-white rounded-2xl border border-gray-100 shadow-xs font-sans">
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          return (
            <div key={stage.key} className="relative">
              {/* Connecting Vertical Line */}
              {idx < stages.length - 1 && (
                <div
                  className={`absolute -left-[19px] sm:-left-[23px] top-4 w-[3px] h-[calc(100%+24px)] transition-colors duration-300 ${
                    idx < currentIdx ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Status Circle Pin */}
              <div
                className={`absolute -left-6 sm:-left-7 top-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  isCompleted || isCurrent
                    ? 'bg-emerald-500 ring-4 ring-emerald-100'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                ) : isCurrent ? (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                ) : (
                  <Circle className="w-1.5 h-1.5 text-gray-300 fill-gray-200" />
                )}
              </div>

              {/* Stage Title */}
              <div>
                <h4
                  className={`text-xs sm:text-sm font-bold leading-tight ${
                    isUpcoming ? 'text-gray-400 font-medium' : 'text-gray-900'
                  }`}
                >
                  {stage.title}
                </h4>

                {/* Sub details shown if completed or active */}
                {(isCompleted || isCurrent) && (
                  <div className="mt-2 space-y-1.5 text-[11px] sm:text-xs text-gray-500">
                    {stage.subItems.map((sub, sIdx) => (
                      <p key={sIdx} className="leading-snug">
                        {sub}
                      </p>
                    ))}
                  </div>
                )}

                {/* Upcoming hint */}
                {isUpcoming && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    Item yet to reach this milestone.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
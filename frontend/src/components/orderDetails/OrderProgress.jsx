import React from 'react';

const STATUS_TO_ACTIVE_STEP_INDEX = {
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 1
};

function formatPlacedDate(orderDate) {
  const parsed = new Date(orderDate);
  if (Number.isNaN(parsed.getTime())) return orderDate;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(parsed);
}

function formatEstimatedDelivery(estimatedDelivery) {
  const parsed = new Date(estimatedDelivery);
  if (Number.isNaN(parsed.getTime())) return estimatedDelivery;
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(parsed);
  return `Est. ${formatted}`;
}

export default function OrderProgress({ status, orderDate, estimatedDelivery }) {
  const activeStepIndex = STATUS_TO_ACTIVE_STEP_INDEX[status] ?? 1;
  const placedDateLabel = formatPlacedDate(orderDate);
  const estimatedDeliveryLabel = formatEstimatedDelivery(estimatedDelivery);

  const steps = [
    { label: 'Order Placed', date: placedDateLabel },
    { label: 'Processing', date: activeStepIndex === 1 ? 'In Progress' : 'Completed' },
    { label: 'Shipped', date: activeStepIndex === 2 ? 'In Progress' : 'Pending' },
    { label: 'Delivered', date: activeStepIndex === 3 ? 'Delivered' : estimatedDeliveryLabel }
  ];

  const stepStateClass = (idx) => {
    if (idx < activeStepIndex) return 'completed';
    if (idx === activeStepIndex) return 'active';
    return '';
  };

  const lineStateClass = (leftIdx) => {
    // line between leftIdx and leftIdx+1 is active when the next step is reached/active
    if (leftIdx < activeStepIndex) return 'active';
    return '';
  };

  return (
    <div className="progress-section">
      <h2 className="section-title">Order Progress</h2>
      <div className="progress-tracker">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className={`progress-step ${stepStateClass(idx)}`.trim()}>
              <div className="step-icon">
                {idx < activeStepIndex ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : idx === activeStepIndex ? (
                  <div className="pulse"></div>
                ) : null}
              </div>
              <div className="step-info">
                <p className="step-label">{step.label}</p>
                <p className="step-date">{step.date}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`progress-line ${lineStateClass(idx)}`.trim()}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}



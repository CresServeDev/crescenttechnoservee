import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicePackages = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 1500,
      services: [
        'Network Security Assessment',
        'Basic Firewall Configuration',
        'Email Security Setup',
        '24/7 Monitoring (Basic)',
        'Monthly Reports'
      ]
    },
    {
      id: 'classic',
      name: 'Classic',
      price: 2500,
      services: [
        'All Basic Services',
        'Advanced Threat Detection',
        'Endpoint Protection',
        'Data Backup & Recovery',
        'Compliance Monitoring',
        'Priority Support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 3500,
      services: [
        'All Classic Services',
        'Custom Security Solutions',
        '24/7 On-site Support',
        'Advanced Analytics',
        'Incident Response',
        'Dedicated Security Team',
        'Quarterly Audits'
      ]
    }
  ];

  const handlePurchase = (plan) => {
    console.log('Navigating to asset inventory with plan:', plan);
    navigate('/asset-inventory', { state: { selectedPlan: plan } });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4">Service Packages</h1>
          <p className="lead">Choose the perfect security package for your business needs</p>
        </div>
      </div>

      <div className="row">
        {plans.map((plan) => (
          <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white text-center">
                <h3 className="card-title mb-0">{plan.name}</h3>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-3">
                  <h2 className="text-primary">₹{plan.price}</h2>
                  <small className="text-muted">per month</small>
                </div>

                <ul className="list-unstyled mb-4">
                  {plan.services.map((service, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      {service}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handlePurchase(plan)}
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <div className="alert alert-info">
            <h5>All packages include:</h5>
            <p className="mb-0">Free initial consultation • Flexible billing • Cancel anytime • 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePackages;

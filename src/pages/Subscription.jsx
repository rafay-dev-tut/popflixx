import React, { useState } from 'react';

function Subscription() {
  const [isYearly, setIsYearly] = useState(false);

  
  const plans = [
    {
      name: "Basic",
      priceMonthly: 4.99,
      priceYearly: 49.99,
      description: "Perfect for casual viewers watching on mobile devices.",
      features: [
        "720p (HD) Streaming",
        "Watch on 1 Device at a time",
        "Mobile & Tablet access only",
        "Unlimited Movies & TV Shows",
        "Contains minimal ads"
      ],
      isPopular: false,
    },
    {
      name: "Standard",
      priceMonthly: 9.99,
      priceYearly: 99.99,
      description: "Our most popular choice for family entertainment.",
      features: [
        "1080p (Full HD) Streaming",
        "Watch on 2 Devices simultaneously",
        "TV, Laptop, Mobile & Tablet access",
        "Unlimited Movies & TV Shows",
        "Completely Ad-Free",
        "Download to watch offline"
      ],
      isPopular: true,
    },
    {
      name: "Premium Ultra",
      priceMonthly: 14.99,
      priceYearly: 149.99,
      description: "The ultimate cinematic experience at your home.",
      features: [
        "4K Ultra HD + HDR Streaming",
        "Watch on 4 Devices simultaneously",
        "TV, Laptop, Mobile & Tablet access",
        "Unlimited Movies & TV Shows",
        "Completely Ad-Free",
        "Download to watch offline",
        "Dolby Atmos Spatial Audio"
      ],
      isPopular: false,
    }
  ];

  return (
    <div className="bg-[#0c0d10] min-h-screen text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
     
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[#841919] font-bold tracking-widest text-xs uppercase bg-[#841919]/10 px-3 py-1 rounded-full border border-[#841919]/20">
            Pricing Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Choose the plan that's right for you
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Join today and get unlimited access to thousands of blockbuster movies, exclusive originals, and award-winning shows. Cancel anytime.
          </p>

       
          <div className="flex justify-center items-center gap-4 pt-6">
            <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-7 bg-gray-800 rounded-full p-1 transition-all duration-300 relative border border-gray-700"
            >
              <div className={`w-5 h-5 bg-[#841919] rounded-full transition-all duration-300 transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isYearly ? 'text-white' : 'text-gray-500'}`}>
              Yearly 
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">Save ~15%</span>
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-[#14151a] rounded-2xl border transition-all duration-300 flex flex-col justify-between p-8 relative h-full ${
                plan.isPopular 
                  ? 'border-[#841919] shadow-2xl shadow-[#841919]/10 scale-105 z-10 md:-translate-y-2' 
                  : 'border-gray-800/60 hover:border-gray-700'
              }`}
            >
            
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#841919] text-white font-bold text-xs uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                  Most Popular
                </span>
              )}

          
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-400 min-h-[32px] mb-6">{plan.description}</p>
                
                {/* Pricing Area */}
                <div className="flex items-baseline gap-1 mb-8 border-b border-gray-800/60 pb-6">
                  <span className="text-3xl sm:text-5xl font-black text-white">
                    ${isYearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-[#841919] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              
              <button 
                className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                  plan.isPopular 
                    ? 'bg-[#841919] hover:bg-[#a62222] text-white shadow-lg shadow-[#841919]/20' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

      
        <div className="mt-24 border-t border-gray-900 pt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-[#14151a] p-6 rounded-xl border border-gray-800/40">
              <h4 className="font-semibold text-white mb-2">Can I cancel my subscription anytime?</h4>
              <p className="text-sm text-gray-400">Yes, absolute commitment-free. You can easily cancel online in just two clicks. There are no cancellation fees – start or stop your account anytime.</p>
            </div>
            <div className="bg-[#14151a] p-6 rounded-xl border border-gray-800/40">
              <h4 className="font-semibold text-white mb-2">How does the yearly discount work?</h4>
              <p className="text-sm text-gray-400">By choosing the yearly toggle option, you pay upfront for 12 months and receive a special discounted rate, saving you nearly 15% overall compared to monthly billings.</p>
            </div>
            <div className="bg-[#14151a] p-6 rounded-xl border border-gray-800/40">
              <h4 className="font-semibold text-white mb-2">On what devices can I stream?</h4>
              <p className="text-sm text-gray-400">Depending on your plan, you can watch via our app on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, Smartphones, and Tablets.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Subscription;
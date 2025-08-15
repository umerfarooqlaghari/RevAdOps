'use client';

const ClientsSection = () => {
  // Dummy client logos using company logo placeholders
  const clients = [
    { id: 1, name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { id: 2, name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { id: 3, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { id: 4, name: "Facebook", logo: "https://logo.clearbit.com/facebook.com" },
    { id: 5, name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { id: 6, name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
    { id: 7, name: "Adobe", logo: "https://logo.clearbit.com/adobe.com" },
    { id: 8, name: "Spotify", logo: "https://logo.clearbit.com/spotify.com" },
    { id: 9, name: "Twitter", logo: "https://logo.clearbit.com/twitter.com" },
    { id: 10, name: "LinkedIn", logo: "https://logo.clearbit.com/linkedin.com" },
    { id: 11, name: "Uber", logo: "https://logo.clearbit.com/uber.com" },
    { id: 12, name: "Airbnb", logo: "https://logo.clearbit.com/airbnb.com" }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Clients
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client) => (
            <div 
              key={client.id}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full h-auto max-h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;

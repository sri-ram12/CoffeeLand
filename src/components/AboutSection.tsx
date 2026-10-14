import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, Sparkles, Users, Clock, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: <Coffee className="w-5 h-5 text-caramel" />,
      title: 'Single-Origin Coffee',
      description: 'Shade-grown Arabica beans ethically harvested from heritage estates in Chikmagalur and roasted to bring out chocolate and caramel undertones.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-caramel" />,
      title: 'Artisanal Bakery & Kitchen',
      description: 'From slow-laminated French croissants to hand-stretched Neapolitan pizzas, every item is crafted fresh in our kitchen with real ingredients.',
    },
    {
      icon: <Heart className="w-5 h-5 text-caramel" />,
      title: 'A Cozy Sanctuary',
      description: 'Designed as a warm sanctuary with ambient warm lighting, plush seating, soft acoustics, and quiet nooks perfect for work, reading, or reunions.',
    },
    {
      icon: <Users className="w-5 h-5 text-caramel" />,
      title: 'Community & Connection',
      description: 'More than a cafe—we are a neighborhood gathering space where ideas are sparked, friendships flourish, and beautiful memories are made.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#EDE0CC] relative overflow-hidden">
      {/* Subtle background ornamentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with Multiple Editorial Images */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Large Image: Cafe Interior & Barista Art */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-terracotta/25 aspect-[4/5] sm:aspect-[4/4.5]">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                  alt="Cozy interior ambience of Coffee Land cafe"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Overlay Quote Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-terracotta/30 shadow-lg">
                  <p className="font-serif italic text-espresso-950 text-sm sm:text-base leading-relaxed">
                    “Coffee isn’t just a drink here. It’s an art form, a pause in a busy day, and an invitation to feel at home.”
                  </p>
                  <span className="block mt-2 text-xs uppercase tracking-widest text-terracotta font-bold">
                    The Coffee Land Promise • Sangivalasa, Vizag
                  </span>
                </div>
              </div>

              {/* Secondary Floating Offset Image: Espresso Crafting */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-44 sm:w-56 aspect-square rounded-2xl overflow-hidden border-2 border-terracotta shadow-xl hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
                  alt="Espresso bean roasting and hand preparation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Coffee Land Official Logo Seal Badge */}
              <div className="absolute -top-6 -left-4 sm:-left-6 p-3 sm:p-4 rounded-2xl bg-white border border-terracotta/30 backdrop-blur-md shadow-xl flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Coffee Land Seal"
                  className="w-12 h-12 rounded-full object-cover border-2 border-terracotta shadow-xs"
                />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-coffee-600 font-bold">Temples Bypass Road</div>
                  <div className="font-serif font-bold text-espresso-950 text-sm">Thagarapuvalasa, Vizag</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Core Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-4 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story & Ambiance</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 leading-tight mb-4">
              More Than Coffee. <br />
              <span className="text-terracotta">Your Happy Place in Vizag.</span>
            </h2>

            {/* Story Text */}
            <p className="text-coffee-800 text-base leading-relaxed mb-4 font-normal">
              Located on <strong className="text-terracotta font-bold">Temples Bypass Road near Sangivalasa (Thagarapuvalasa, Visakhapatnam)</strong>, <strong className="text-espresso-950 font-bold">COFFEE LAND RESTO & CAFE</strong> is the go-to gathering sanctuary for coffee lovers, students from nearby institutions like ANITS, traveling foodies, and families.
            </p>

            <p className="text-coffee-700 text-sm leading-relaxed mb-8">
              Whether you are here for a freshly extracted espresso to power your day, a sizzling brownie skillet, a crispy loaded brioche burger, hand-tossed Neapolitan pizza, or our legendary Lotus Biscoff Kunafa, we welcome you with warm coastal hospitality and fast, friendly service.
            </p>

            {/* Four Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-terracotta/20 hover:border-terracotta/50 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EDE0CC] border border-terracotta/20 flex items-center justify-center mb-3 text-terracotta">
                    {pillar.icon}
                  </div>
                  <h4 className="font-serif text-base font-bold text-espresso-950 mb-1.5">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-coffee-700 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

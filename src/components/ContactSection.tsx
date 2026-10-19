import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) errs.message = 'Please write your message';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#EDE0CC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/25 text-terracotta text-xs font-bold uppercase tracking-widest mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect & Visit Us</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 mb-4">
            Visit Coffee Land Resto & Cafe
          </h2>
          <p className="text-sm sm:text-base text-coffee-800">
            Conveniently situated on Temples Bypass Road near Sangivalasa (Thagarapuvalasa, Vizag). Dine in, pick up takeaway, or reserve a table!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Cafe Info & Real Google Maps Embed */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Information Card */}
            <div className="p-8 rounded-3xl bg-white border border-terracotta/20 shadow-lg space-y-6">
              <h3 className="font-serif text-2xl font-bold text-espresso-950">
                Cafe Location & Timings
              </h3>

              <div className="space-y-5 text-sm text-coffee-800">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE0CC] border border-terracotta/25 flex items-center justify-center text-terracotta flex-shrink-0 mt-0.5 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso-950 text-xs uppercase tracking-wider mb-1 text-terracotta">
                      Official Address (Google Maps)
                    </h4>
                    <p className="text-coffee-800 leading-relaxed text-xs sm:text-sm font-medium">
                      Temples By Pass Road, near 3, Thagarapuvalasa,<br />
                      Sanghivalasa, Bheemunipatnam, Visakhapatnam,<br />
                      Andhra Pradesh — 531162
                    </p>
                    <a
                      href="https://maps.app.goo.gl/Xkpi9H6ueRbUqH4UA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline mt-1.5"
                    >
                      <span>Get Driving Directions on Google Maps</span>
                      <span>➔</span>
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE0CC] border border-terracotta/25 flex items-center justify-center text-terracotta flex-shrink-0 mt-0.5 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso-950 text-xs uppercase tracking-wider mb-1 text-terracotta">
                      Operating Hours
                    </h4>
                    <p className="text-coffee-800 text-xs sm:text-sm font-medium">
                      Monday – Sunday: 10:00 AM – 10:00 PM<br />
                      <span className="text-[11px] text-coffee-600 font-semibold">Open 7 Days a Week (Dine-in, Takeaway & Drive-Through)</span>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE0CC] border border-terracotta/25 flex items-center justify-center text-terracotta flex-shrink-0 mt-0.5 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso-950 text-xs uppercase tracking-wider mb-1 text-terracotta">
                      Phone Numbers
                    </h4>
                    <p className="text-coffee-800 text-xs sm:text-sm font-medium">
                      <a href="tel:+919032992524" className="hover:text-terracotta font-bold text-espresso-950">
                        +91 90329 92524
                      </a>
                      <span className="mx-2 text-coffee-400">•</span>
                      <a href="tel:+919542525665" className="hover:text-terracotta font-medium">
                        +91 95425 25665
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE0CC] border border-terracotta/25 flex items-center justify-center text-terracotta flex-shrink-0 mt-0.5 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-espresso-950 text-xs uppercase tracking-wider mb-1 text-terracotta">
                      Email
                    </h4>
                    <p className="text-coffee-800 text-xs sm:text-sm font-medium">
                      info@coffeeland.in
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Enquiry CTA */}
              <div className="pt-4 border-t border-terracotta/15">
                <a
                  href="https://wa.me/919542525665?text=Hello%20Coffee%20Land!%20I%20would%20like%20to%20enquire%20about%20your%20menu%20and%20table%20reservation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Coffee Land on WhatsApp</span>
                </a>
                <p className="text-[11px] text-coffee-600 text-center mt-2 font-medium">
                  Instant table reservations, party bookings, and food delivery queries.
                </p>
              </div>
            </div>

            {/* REAL GOOGLE MAPS EMBED */}
            <div className="rounded-3xl overflow-hidden border border-terracotta/20 bg-white p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs text-coffee-800">
                <span className="font-bold uppercase tracking-wider text-terracotta">
                  Live Google Map (Sangivalasa, Vizag)
                </span>
                <span className="font-bold text-espresso-950">4.7 ★ (263+ Reviews)</span>
              </div>
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-terracotta/20 shadow-xs">
                <iframe
                  title="Coffee Land Google Map Location"
                  src="https://maps.google.com/maps?q=17.9230437,83.4193173&hl=en&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-coffee-700">Near ANITS Engineering College, NH16 Bypass</span>
                <a
                  href="https://maps.app.goo.gl/Xkpi9H6ueRbUqH4UA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-terracotta hover:underline"
                >
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Validation in Reversed Theme */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-terracotta/20 shadow-lg">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-coffee-700 mb-6 font-medium">
                Have questions about parties, custom cake orders, or corporate gatherings? Fill in the details below.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-50 border border-emerald-500/40 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-espresso-950">
                    Thank You, {formData.name}!
                  </h4>
                  <p className="text-sm text-coffee-800 max-w-md mx-auto">
                    Your inquiry has been received. Our manager will get in touch with you shortly on {formData.phone || formData.email}.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'General Enquiry',
                        message: '',
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-coffee-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Maya Sharma"
                        className={`w-full px-4 py-3 rounded-xl bg-[#EDE0CC] border text-sm text-espresso-950 placeholder-espresso-400 focus:outline-none transition-all ${
                          errors.name
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-terracotta/25 focus:border-terracotta focus:ring-1 focus:ring-terracotta'
                        }`}
                      />
                      {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-coffee-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. maya@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#EDE0CC] border text-sm text-espresso-950 placeholder-espresso-400 focus:outline-none transition-all ${
                          errors.email
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-terracotta/25 focus:border-terracotta focus:ring-1 focus:ring-terracotta'
                        }`}
                      />
                      {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-coffee-700 mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 95425 25665"
                        className="w-full px-4 py-3 rounded-xl bg-[#EDE0CC] border border-terracotta/25 text-sm text-espresso-950 placeholder-espresso-400 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-coffee-700 mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#EDE0CC] border border-terracotta/25 text-sm text-espresso-950 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta cursor-pointer"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Table Reservation">Table Reservation Request</option>
                        <option value="Birthday & Party Booking">Birthday & Party Booking</option>
                        <option value="Catering & Bulk Order">Catering & Bulk Order</option>
                        <option value="Feedback">Feedback on Coffee & Food</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-coffee-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your visit, event requirements, or favorite dish..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#EDE0CC] border text-sm text-espresso-950 placeholder-espresso-400 focus:outline-none transition-all ${
                        errors.message
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-terracotta/25 focus:border-terracotta focus:ring-1 focus:ring-terracotta'
                      }`}
                    />
                    {errors.message && <span className="text-xs text-rose-500 mt-1 block">{errors.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Cafe</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

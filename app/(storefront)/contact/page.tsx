"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  const whatsappPhone = "2349037036463";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    "Hello Yankee Gadgets! I would like to make an inquiry."
  )}`;

  return (
    <div className="bg-surface-alt min-h-screen py-16 px-4">
      <div className="mx-auto max-w-5xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-black text-ink-900 md:text-5xl">
            Get in Touch
          </h1>
          <p className="text-sm text-ink-700 max-w-xl mx-auto">
            Have questions about gadget conditions, custom orders, or delivery status? Reach out directly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Contact information */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium space-y-6">
            <h3 className="font-display font-bold text-ink-900 text-lg border-b border-border pb-2">
              Store Information
            </h3>

            <ul className="space-y-5 text-sm text-ink-700">
              {/* Location */}
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink-900">Showroom Location</h4>
                  <p className="mt-0.5">1st Floor, Taiyelolu Tower, 2A Olaide Tomori St, Ikeja, Lagos</p>
                </div>
              </li>

              {/* Call */}
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink-900">Call Support</h4>
                  <p className="mt-0.5">+234 807 308 3426</p>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink-900">Email Address</h4>
                  <p className="mt-0.5">info@yankeegadgets.ng</p>
                </div>
              </li>

              {/* Hours */}
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink-900">Showroom Hours</h4>
                  <p className="mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-xs text-ink-400">Sunday: Closed</p>
                </div>
              </li>
            </ul>

            {/* Direct WhatsApp trigger */}
            <div className="pt-4 border-t border-border">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-lg font-bold transition-all text-sm shadow-premium"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Panel: Contact form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-premium">
            <h3 className="font-display font-bold text-ink-900 text-lg border-b border-border pb-2 mb-6">
              Send a Message
            </h3>

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 text-sm rounded-lg font-medium">
                Thank you! Your message was sent successfully. We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="contact_name" className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  id="contact_name"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact_email" className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  id="contact_email"
                  required
                  placeholder="e.g. email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact_message" className="block text-[10px] font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact_message"
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface-alt border border-border text-sm px-4 py-3 rounded-lg placeholder-ink-400 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-orange hover:bg-brand-orange-light text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-premium transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

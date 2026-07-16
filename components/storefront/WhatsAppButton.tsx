"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show a small hover notification 3 seconds after loading to engage users
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "2349037036463"; // Uncle Emeka's WhatsApp phone number
  const message = encodeURIComponent(
    "Hello Yankee Gadgets! I'm browsing your online store and would like to make an inquiry."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Dynamic Pop-up Notification */}
      {showNotification && (
        <div className="bg-ink-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-premium border border-border/10 flex items-center gap-2 max-w-xs animate-bounce font-medium relative mr-2">
          <span>Need help? Chat with us on WhatsApp!</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowNotification(false);
            }}
            className="text-ink-400 hover:text-white text-[10px] font-bold ml-1 p-0.5"
          >
            ✕
          </button>
          <div className="absolute right-4 bottom-[-6px] w-3 h-3 bg-ink-900 rotate-45 border-r border-b border-border/10" />
        </div>
      )}

      {/* Floating Button Icon */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowNotification(false)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 group-hover:shadow-green-500/20"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
}

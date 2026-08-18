import React from 'react';
import { Lock, EyeOff, ShieldCheck, Database, HardDrive } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <footer
      id="privacy"
      className="relative w-full max-w-4xl mx-auto px-4 py-16 text-center text-xs font-noto"
      aria-label="Privacy and Legal Notice"
    >
      <div className="glass-dark imperial-border p-8 rounded-sm text-left">
        <div className="flex items-center gap-2 text-imperial-gold font-cinzel text-xs font-bold tracking-[0.25em] uppercase mb-4">
          <Lock className="w-4 h-4 text-bright-gold" />
          <span>PRIVACY & SECURITY CHARTER</span>
        </div>

        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-ivory mb-3">
          100% Free & In-Browser Architecture ($0 / ₹0 Cost)
        </h3>

        <p className="text-aged-paper/80 leading-relaxed mb-6">
          The Imperial Covenant is engineered with absolute respect for your data sovereignty and requires <strong>zero paid cloud services or subscriptions</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-black/40 rounded border border-imperial-gold/15">
            <div className="flex items-center gap-2 text-bright-gold font-cinzel font-semibold mb-1">
              <EyeOff className="w-4 h-4" />
              <span>Zero Cloud Upload</span>
            </div>
            <p className="text-[11px] text-aged-paper/70">
              Signatures, names, and photos never leave your device. All rendering is local.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded border border-imperial-gold/15">
            <div className="flex items-center gap-2 text-bright-gold font-cinzel font-semibold mb-1">
              <HardDrive className="w-4 h-4" />
              <span>Local Storage</span>
            </div>
            <p className="text-[11px] text-aged-paper/70">
              Data persists only in your browser's private storage and can be wiped instantly.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded border border-imperial-gold/15">
            <div className="flex items-center gap-2 text-bright-gold font-cinzel font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Permission Guard</span>
            </div>
            <p className="text-[11px] text-aged-paper/70">
              Camera access is requested explicitly with full user consent and can be retaken or skipped.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="border-t border-imperial-gold/20 pt-4 text-center">
          <p className="text-[11px] text-aged-paper/60 italic font-noto">
            "This is an internal team working charter and is not a substitute for a legal agreement."
          </p>
          <p className="text-[10px] text-imperial-gold/40 font-cinzel tracking-widest mt-2 uppercase">
            THE IMPERIAL COVENANT • STATIC GITHUB PAGES ARCHITECTURE • ZERO SUBSCRIPTIONS
          </p>
        </div>
      </div>
    </footer>
  );
}

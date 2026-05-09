"use client";

import { AudioLines } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-base-100 border-b border-base-300 px-4 h-22 flex items-center justify-between max-w-5xl mx-auto">
      <div className="flex-1 flex justify-center">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPri1GdoQESDNDsiShHXnfAPKTEMYbaYqi9t0Laj_u2uUxZ5QezNsd2lErIvwREAvBlueF7XZWs2B0mRft2gFXm27Q7xvBIlJMUU9hpNhPxpXB_CkxawcDBGVpRHwuM6pf1w387JwbVk9JEsPMXPhvTXZ6qBOP3g0d_MJvx8cB0j4UsDP-H_pqUeIdZN_3TgkBTDYftbRPjvvTbLrYhE7zu-q8uXWuhKE24dom2vZp3iT7T3hiEfLj4FQ660K-5bpuGB81XtFBO8g"
          alt="Babble Logo"
          className="h-20"
        />
      </div>
    </header>
  );
}

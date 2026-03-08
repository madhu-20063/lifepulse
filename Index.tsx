import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Mic, MicOff } from "lucide-react";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
import SOSButton from "@/components/SOSButton";
import QuickActions from "@/components/QuickActions";
import AmbulanceTracker from "@/components/AmbulanceTracker";
import NearbyHospitals from "@/components/NearbyHospitals";
import EmergencyAlert from "@/components/EmergencyAlert";
import BottomNav from "@/components/BottomNav";
import { useVoiceSOS } from "@/hooks/useVoiceSOS";

const Index = () => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const cooldownRef = useRef(false);

  const handleSOS = useCallback(() => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setSosTriggered(true);
    toast.error("🚨 Emergency SOS Activated!", {
      description: "Contacting emergency services and sharing your location...",
      duration: 5000,
    });
    setTimeout(() => {
      setSosTriggered(false);
      cooldownRef.current = false;
    }, 5000);
  }, []);

  const handleVoiceSOS = useCallback(() => {
    handleSOS();
    toast.info("🎙️ Voice command detected!", {
      description: "Emergency keyword recognized — activating SOS.",
      duration: 3000,
    });
  }, [handleSOS]);

  const { isListening, lastHeard, supported, startListening, stopListening } =
    useVoiceSOS(handleVoiceSOS);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pb-24">
        <StatusBar />
        <Header />

        {/* Voice Control Toggle */}
        {supported && (
          <section className="mb-3 animate-slide-up">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isListening
                  ? "bg-emergency/10 border-emergency/30 text-emergency"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {isListening ? (
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emergency/40" />
                  <Mic className="relative h-5 w-5" />
                </span>
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <MicOff className="h-4 w-4" />
                </span>
              )}
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold">
                  {isListening ? "Voice SOS Active" : "Voice SOS Off"}
                </p>
                <p className="text-[10px] opacity-70">
                  {isListening
                    ? lastHeard
                      ? `Heard: "${lastHeard}"`
                      : 'Say "Help me", "Ambulance", or "Emergency"'
                    : "Tap to enable hands-free emergency activation"}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isListening
                    ? "bg-emergency/20 text-emergency"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isListening ? "LIVE" : "OFF"}
              </span>
            </button>
          </section>
        )}

        {/* Alert */}
        <section className="mb-4">
          <EmergencyAlert />
        </section>

        {/* SOS Section */}
        <section className="flex flex-col items-center py-6 animate-slide-up">
          <SOSButton onActivate={handleSOS} />
          <p className="text-[10px] text-muted-foreground mt-5 text-center max-w-[200px]">
            Hold the button for 1.5 seconds to contact emergency services
          </p>
        </section>

        {/* Quick Actions */}
        <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Ambulance Tracker */}
        <section className="mb-5">
          <AmbulanceTracker />
        </section>

        {/* Nearby Hospitals */}
        <section className="mb-5">
          <NearbyHospitals />
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;

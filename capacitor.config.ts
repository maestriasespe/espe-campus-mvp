import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "mx.espe.campus",
  appName: "ESPE Campus",
  webDir: "public",
  server: {
    url: "https://espe-campus-mvp.vercel.app",
    cleartext: false
  }
};

export default config;

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	server: {
		allowedHosts: ["matlikeys.com", "www.matlikeys.com"],
	},
	plugins: [react()],
});

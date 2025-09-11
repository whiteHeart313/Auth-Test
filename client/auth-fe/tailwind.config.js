/** @type {import('tailwindcss').Config} */
// Design System
import tailwindcss_animate from "tailwindcss-animate";

import ColorSystem, { MessagesColors } from "./design-system/colors";
import FontSizes, { BodyFontSizes } from "./design-system/font-sizes";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				...ColorSystem,
				...MessagesColors,

				// Shadcn Colors
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))"
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))"
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))"
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))"
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))"
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))"
				}
			},
			fontFamily: {
				primary: ["DMSans", "sans-serif"]
			},
			fontSize: {
				...FontSizes,
				...BodyFontSizes
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-15px)" }
				},
				enter: {
					"0%": {
						transform: "scale(0.9)",
						opacity: 0
					},
					"100%": {
						transform: "scale(1)",
						opacity: 1
					}
				},
				leave: {
					"0%": {
						transform: "scale(1)",
						opacity: 1
					},
					"100%": {
						transform: "scale(0.9)",
						opacity: 0
					}
				}
			},
			animation: {
				float: "float 5s ease-in-out infinite",
				enter: "enter 0.3s ease-in-out",
				leave: "leave 0.3s ease-out 1 forwards"
			},
			transitionProperty: {
				width: "width"
			}
		}
	},
	plugins: [tailwindcss_animate]
};


import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				flydining: {
					purple: '#7B61FF',
					secondary: '#4F4F4F',
					dark: '#3D3D3D',
					success: '#00C48C',
					warning: '#FFA26B',
					error: '#FF647C',
					info: '#1D1D28',
				},
				airline: {
					DEFAULT: '#1E3A8A',
					light: '#3B82F6',
					dark: '#0F2659'
				},
				dining: {
					DEFAULT: '#F97316',
					light: '#FDBA74',
					dark: '#9C4501'
				},
				amusement: {
					DEFAULT: '#8B5CF6',
					light: '#C4B5FD',
					dark: '#5B2EBD'
				},
				spotBooking: '#EB1A45'
			},
			borderRadius: {
				lg: '0.5rem',     // 8px for buttons & tags
				md: '0.375rem',    // 6px for input fields
				sm: '0.25rem',     // 4px
				xl: '0.75rem',     // 12px for cards
				'2xl': '1rem',     // 16px
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 8px 2px rgba(123, 97, 255, 0.2)'
					},
					'50%': {
						boxShadow: '0 0 12px 4px rgba(123, 97, 255, 0.3)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'glow-pulse': 'glow-pulse 4s infinite ease-in-out',
				'float': 'float 5s infinite ease-in-out'
			},
			fontFamily: {
				sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			spacing: {
				// Consistent spacing scale
				'1': '0.25rem',    // 4px
				'2': '0.5rem',     // 8px
				'3': '0.75rem',    // 12px
				'4': '1rem',       // 16px
				'5': '1.25rem',    // 20px
				'6': '1.5rem',     // 24px
				'8': '2rem',       // 32px
				'10': '2.5rem',    // 40px
				'12': '3rem',      // 48px
			},
			fontSize: {
				// Consistent font size scale
				'xs': '0.75rem',   // 12px
				'sm': '0.875rem',  // 14px - body text
				'base': '1rem',    // 16px - labels
				'lg': '1.125rem',  // 18px - headers
				'xl': '1.25rem',   // 20px
				'2xl': '1.5rem',   // 24px
			},
			fontWeight: {
				// Consistent font weights
				'normal': '400',   // body text
				'medium': '500',   // subheadings
				'semibold': '600', // titles
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

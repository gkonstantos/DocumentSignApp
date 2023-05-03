/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			borderRadius: {
				circle: "100%",
			},
			zIndex: {
				'modal': 990,
				'toaster': 992,
				'splash': 999,
			}
		},
		screens: {
			us: "340px",
			xs: "480px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",			
		},
	},
	variants: {
		extend: {
			lineClamp: ["hover"],
		},
	},
	
};

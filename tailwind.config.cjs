/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.tsx"],
	theme: {
		extend: {
			gridTemplateColumns: {
				tier: "repeat(5, minmax(120px, 1fr))",
				unranked : 'repeat(3, minmax(65px, 1fr))'
			},
		},
	},
	plugins: [],
};

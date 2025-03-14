module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/app/page.tsx",
    ],
    theme: {
        extend: {
            colors: {
                'sodium': {
                    100: '#F8F3D9',
                    200: '#EBE5C2',
                    300: '#B9B28A',
                    400: '#504B38',
                },
            },
        },
    },
    plugins: [],
};

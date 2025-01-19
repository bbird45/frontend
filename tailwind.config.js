module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'sm': '640px', // สำหรับมือถือขนาดเล็ก
        'md': '768px', // สำหรับแท็บเล็ต
        'lg': '1024px', // สำหรับหน้าจอขนาดกลาง
        'xl': '1280px', // สำหรับหน้าจอขนาดใหญ่
      },
    },
  },
  plugins: [],
};

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base:"/",
  plugins: [react(), svgr(),
    viteTsconfigPaths(),],
  server: {
    open:true,
    port: 3000,
  },
  preview: {
    port: 3000,
},
//   define: {
//     'process.env': {}
// },
})

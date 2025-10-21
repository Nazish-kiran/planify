import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./planner.css";
import './globals.css'
import '../styles/Themes/dark.css'
import '../styles/Themes/light.css' 
import '../styles/Themes/ocean.css'
import '../styles/Themes/forest.css'
import '../styles/Themes/sunset.css'
import '../styles/Themes/royal.css'
import '../styles/Themes/cyber.css'

export const metadata = {
  title: "Planify",
  description: "Create Your Own Customised Planner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`antialiased m-0`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import './globals.css'


export const metadata = {
   title: 'PLANZIO AI – Plan Your Life with AI',
  description: 'Turn your goals, routines, and ambitions into actionable plans with AI-powered planners.',

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

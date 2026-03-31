import "./globals.css";

export const metadata = {
  title: "Aplicație Rețete",
  description: "CRUD cu Next.js și localStorage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
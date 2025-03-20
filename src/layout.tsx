mport type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sodium Defect Detection",
  description: "Defect Detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased flex-col pl-auto pr-auto justify-items-center`}
      >
        {children}
      </body>
    </html>
  );
}

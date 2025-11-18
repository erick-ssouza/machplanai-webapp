import "./globals.css";

export const metadata = {
  title: "MachPlan",
  description: "Sistema de planejamento de usinagem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

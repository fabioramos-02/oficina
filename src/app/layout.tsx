export const metadata = {
  title: 'Sistema de Oficina Mecânica',
  description: 'Sistema de gestão para oficinas mecânicas',
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

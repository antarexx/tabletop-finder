export const metadata = {
  title: "Tabletop Finder",
  description: "Find tabletop players near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

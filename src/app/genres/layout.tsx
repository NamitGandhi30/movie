import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Movies by Genre | Movie Explorer",
  description: "Browse and discover movies across different genres like Action, Comedy, Drama, and more on Movie Explorer.",
};

export default function GenresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
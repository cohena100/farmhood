import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  modal: ReactNode;
  params: { locale: string };
}

export default function Layout({ children, modal, params }: LayoutProps) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}

import { Header } from "@/components/shared/common/header/header";
import Footer from "@/components/shared/common/footer/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-14">
        {children}
      </div>
      <Footer />
    </>
  );
}

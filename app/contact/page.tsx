import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { SITE_NAME } from "@/lib/constants";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F7F4EF]">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <PageHeader
            eyebrow="Contact"
            title={`Contact ${SITE_NAME}`}
            description="Buyer inquiries route through the admin WhatsApp flow so owner details stay private."
          />
          <div className="rounded-md bg-white p-6 shadow-[0_24px_70px_rgba(7,17,31,0.12)]">
            <h2 className="text-2xl font-black text-[#07111F]">Privacy rule</h2>
            <p className="mt-4 text-sm leading-7 text-[#1F2937]/72">
              Public pages should never show seller contact numbers. Buyer contact
              will route through the admin WhatsApp number once backend setup is
              added.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

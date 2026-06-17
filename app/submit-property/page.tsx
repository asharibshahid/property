import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { SubmitPropertyForm } from "@/components/public/SubmitPropertyForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { ADMIN_WHATSAPP_NUMBER, propertyMediaLimits } from "@/lib/constants";

export default function SubmitPropertyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F7F4EF]">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <PageHeader
              eyebrow="Seller submission"
              title="Submit a property"
              description="Complete the form and our team will review the listing before it appears publicly."
            />
            <div className="mt-6 rounded-md border border-[#07111F]/8 bg-white p-5 text-sm leading-6 text-[#1F2937]/72 shadow-sm">
              Public buyers will never see seller contact details. In the backend
              phase, every submission will be saved as pending first.
            </div>
          </div>

          <SubmitPropertyForm
            adminWhatsAppNumber={ADMIN_WHATSAPP_NUMBER}
            mediaLimits={propertyMediaLimits}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}

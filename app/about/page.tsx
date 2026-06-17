import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { SITE_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F7F4EF]">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="About"
            title={SITE_NAME}
            description="MALIK IMPERIUM ESTATES is a custom-coded Karachi real estate website focused on clean browsing, premium UI, and an admin approval workflow."
          />
          <div className="mt-8 rounded-md bg-white p-6 shadow-[0_18px_50px_rgba(7,17,31,0.08)]">
            <p className="text-lg leading-9 text-[#1F2937]/78">
              This version connects Supabase for seller submissions, admin
              review, image storage, and approved-only public publishing.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

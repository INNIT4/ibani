import { getSiteTexts } from "@/lib/firestore";
import FaqAccordion from "./FaqAccordion";

export const revalidate = 300;

export default async function FAQPage() {
  const texts = await getSiteTexts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-800 mb-2">{texts.faq_title}</h1>
      <span className="accent-bar" />
      <p className="text-slate-500 mb-12 mt-6 font-light">{texts.faq_subtitle}</p>
      <FaqAccordion items={texts.faq_items} />
    </div>
  );
}

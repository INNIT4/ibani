"use client";

import { useEffect, useState } from "react";
import {
  getSiteTexts,
  setSiteTexts,
  DEFAULT_SITE_TEXTS,
  SiteTexts,
  FaqItem,
  HowItWorksStep,
  ValueCard,
} from "@/lib/firestore";

type Tab = "inicio" | "pasos" | "nosotros" | "faq";

export default function AdminContenidoPage() {
  const [texts, setTexts] = useState<SiteTexts>(DEFAULT_SITE_TEXTS as SiteTexts);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>("inicio");

  useEffect(() => {
    getSiteTexts().then((t: any) => {
      setTexts(t as SiteTexts);
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true);
    await setSiteTexts(texts);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function set<K extends keyof SiteTexts>(key: K, value: SiteTexts[K]) {
    setTexts((prev: SiteTexts) => ({ ...prev, [key]: value }));
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    );

  const tabs: { id: Tab; label: string }[] = [
    { id: "inicio", label: "Inicio" },
    { id: "pasos", label: "Cómo participar" },
    { id: "nosotros", label: "Sobre nosotros" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Editor de Contenido</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Administra los textos del sitio público</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          {saving ? "Guardando..." : saved ? "¡Configuración Guardada!" : "Actualizar Contenido"}
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Secciones del Sitio</p>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                tab === t.id
                  ? "bg-white border-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-400 border-transparent hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* ── Inicio ── */}
          {tab === "inicio" && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm space-y-8">
              <h2 className="text-xl font-black text-slate-900 mb-6">Página de Inicio (Hero)</h2>
              <Field label="Título principal (H1)">
                <input
                  value={texts.hero_title}
                  onChange={(e) => set("hero_title", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Subtítulo descriptivo">
                <textarea
                  value={texts.hero_subtitle}
                  onChange={(e) => set("hero_subtitle", e.target.value)}
                  rows={4}
                  className={inputCls}
                />
              </Field>
              <Field label="Pasarela de pagos (Texto)">
                <input
                  value={texts.hero_banks_text}
                  onChange={(e) => set("hero_banks_text", e.target.value)}
                  className={inputCls}
                  placeholder="Ej: BBVA · Santander · Nu · OXXO"
                />
              </Field>
            </div>
          )}

          {/* ── Cómo participar ── */}
          {tab === "pasos" && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <Field label="Título de la sección instructiva">
                  <input
                    value={texts.how_it_works_title}
                    onChange={(e) => set("how_it_works_title", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid gap-6">
                {texts.how_it_works_steps.map((step: HowItWorksStep, i: number) => (
                  <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">0{i + 1}</div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Paso del Usuario</p>
                    </div>
                    <div className="space-y-6">
                      <Field label="Título del paso">
                        <input
                          value={step.title}
                          onChange={(e) => {
                            const updated: HowItWorksStep[] = texts.how_it_works_steps.map((s: HowItWorksStep, j: number) =>
                              j === i ? { ...s, title: e.target.value } : s
                            );
                            set("how_it_works_steps", updated);
                          }}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Instrucciones detalladas">
                        <textarea
                          value={step.desc}
                          onChange={(e) => {
                            const updated: HowItWorksStep[] = texts.how_it_works_steps.map((s: HowItWorksStep, j: number) =>
                              j === i ? { ...s, desc: e.target.value } : s
                            );
                            set("how_it_works_steps", updated);
                          }}
                          rows={3}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Sobre nosotros ── */}
          {tab === "nosotros" && (
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm space-y-8">
                <h2 className="text-xl font-black text-slate-900 mb-6">Nuestra Identidad</h2>
                <Field label="Título de la misión empresarial">
                  <input
                    value={texts.about_mission_title}
                    onChange={(e) => set("about_mission_title", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Narrativa de la empresa">
                  <textarea
                    value={texts.about_mission_text}
                    onChange={(e) => set("about_mission_text", e.target.value)}
                    rows={6}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid gap-8">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Valores Diferenciales</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {texts.about_values.map((card: ValueCard, i: number) => (
                    <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                      <div className="flex gap-4 mb-6">
                        <div className="w-16">
                          <Field label="Emoji">
                            <input
                              value={card.icon}
                              onChange={(e) => {
                                const updated: ValueCard[] = texts.about_values.map((c: ValueCard, j: number) =>
                                  j === i ? { ...c, icon: e.target.value } : c
                                );
                                set("about_values", updated);
                              }}
                              className={`${inputCls} text-center text-xl`}
                              maxLength={4}
                            />
                          </Field>
                        </div>
                        <div className="flex-1">
                          <Field label="Titular">
                            <input
                              value={card.title}
                              onChange={(e) => {
                                const updated: ValueCard[] = texts.about_values.map((c: ValueCard, j: number) =>
                                  j === i ? { ...c, title: e.target.value } : c
                                );
                                set("about_values", updated);
                              }}
                              className={inputCls}
                            />
                          </Field>
                        </div>
                      </div>
                      <Field label="Descripción de impacto">
                        <textarea
                          value={card.desc}
                          onChange={(e) => {
                            const updated: ValueCard[] = texts.about_values.map((c: ValueCard, j: number) =>
                              j === i ? { ...c, desc: e.target.value } : c
                            );
                            set("about_values", updated);
                          }}
                          rows={3}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm space-y-8">
                <h2 className="text-xl font-black text-slate-900 mb-6">Argumentos de Venta</h2>
                <Field label="Título ¿Por qué nosotros?">
                  <input
                    value={texts.about_why_title}
                    onChange={(e) => set("about_why_title", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Lista de Beneficios</p>
                  {texts.about_why_items.map((item: string, i: number) => (
                    <div key={i} className="flex gap-3 group">
                      <input
                        value={item}
                        onChange={(e) => {
                          const updated = texts.about_why_items.map((v: string, j: number) => (j === i ? e.target.value : v));
                          set("about_why_items", updated);
                        }}
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        onClick={() => set("about_why_items", texts.about_why_items.filter((_: string, j: number) => j !== i))}
                        className="w-11 h-11 flex items-center justify-center text-brand-red bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => set("about_why_items", [...texts.about_why_items, ""])}
                    className="text-[10px] font-black text-brand-red uppercase tracking-widest px-6 py-4 bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all flex items-center gap-2"
                  >
                    <span>+</span>
                    <span>Añadir nuevo beneficio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── FAQ ── */}
          {tab === "faq" && (
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Título de cabecera">
                    <input
                      value={texts.faq_title}
                      onChange={(e) => set("faq_title", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Bajada o descripción">
                    <input
                      value={texts.faq_subtitle}
                      onChange={(e) => set("faq_subtitle", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-red" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Base de Conocimiento (FAQ)</p>
                  </div>
                  <button
                    onClick={() => set("faq_items", [...texts.faq_items, { q: "", a: "" }])}
                    className="text-[10px] font-black text-brand-red uppercase tracking-widest"
                  >
                    + Nueva Pregunta
                  </button>
                </div>

                {texts.faq_items.map((item: FaqItem, i: number) => (
                  <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm relative group overflow-hidden">
                    <button
                      onClick={() => set("faq_items", texts.faq_items.filter((_: FaqItem, j: number) => j !== i))}
                      className="absolute top-6 right-6 text-[10px] font-black text-rose-300 hover:text-brand-red uppercase tracking-widest transition-colors"
                    >
                      Remover
                    </button>
                    <div className="space-y-6 pt-2">
                      <Field label={`Interrogante #${i + 1}`}>
                        <input
                          value={item.q}
                          onChange={(e) => {
                            const updated: FaqItem[] = texts.faq_items.map((f: FaqItem, j: number) =>
                              j === i ? { ...f, q: e.target.value } : f
                            );
                            set("faq_items", updated);
                          }}
                          className={`${inputCls} font-black text-slate-900 border-none px-0 focus:ring-0 placeholder-slate-200`}
                          placeholder="Escribe la pregunta aquí..."
                        />
                      </Field>
                      <Field label="Respuesta oficial">
                        <textarea
                          value={item.a}
                          onChange={(e) => {
                            const updated: FaqItem[] = texts.faq_items.map((f: FaqItem, j: number) =>
                              j === i ? { ...f, a: e.target.value } : f
                            );
                            set("faq_items", updated);
                          }}
                          rows={4}
                          className={inputCls}
                          placeholder="Escribe la respuesta detallada..."
                        />
                      </Field>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => set("faq_items", [...texts.faq_items, { q: "", a: "" }])}
                  className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-[10px] font-black text-slate-300 hover:text-slate-400 hover:border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]"
                >
                  Click para expandir el FAQ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-brand-red transition-all shadow-inner";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{label}</label>
      {children}
    </div>
  );
}

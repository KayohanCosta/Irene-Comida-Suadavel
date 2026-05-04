import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-meals.jpg";
import meal1 from "@/assets/meal-1.jpg";
import meal2 from "@/assets/meal-2.jpg";

import { Leaf, Clock, Heart, Truck, MessageCircle, Instagram, Check, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Irene comidas fitness Fortaleza" },
      {
        name: "description",
        content:
          "Recupere seu tempo com marmitas saudáveis, frescas e saborosas em Fortaleza. Cardápio personalizado e entrega refrigerada para sua rotina.",
      },
    ],
    links: [{ rel: "icon", type: "image/png", href: "/favicon.png?v=2" }],
  }),
});

const WHATSAPP = "5585996565697";
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-background">
            <Leaf className="h-6 w-6" />
            <span className="font-display text-xl font-semibold">Irene Comida Saudável</span>
          </a>
          <a
            href={waLink("Olá Irene! Vim pelo site e quero fazer um pedido 💚")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-whatsapp text-whatsapp-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            <MessageCircle className="h-4 w-4" /> Pedir agora
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Background Decorative Leaves */}
        <Leaf className="leaf-premium animate-float top-20 -left-12 w-48 h-48 -rotate-45" />
        <Leaf className="leaf-premium animate-float -bottom-10 right-1/4 w-64 h-64 rotate-[160deg] opacity-5" style={{ animationDelay: "-3s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 lg:pt-40 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-background">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/10 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest border border-background/20">
              <Leaf className="h-3.5 w-3.5" /> Fortaleza · CE
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95]">
              Sua rotina mais leve com <em className="not-italic text-accent">comida de verdade</em>.
            </h1>
            <p className="mt-6 text-lg text-background/80 max-w-xl leading-relaxed">
              Liberte-se da cozinha sem abrir mão da saúde. Marmitas frescas e equilibradas, 
              preparadas para que você foque no que realmente importa.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={waLink(
                  "Olá Irene! Quero conhecer o cardápio e fazer um pedido 🥗",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-whatsapp text-whatsapp-foreground px-7 py-4 text-base font-semibold shadow-[var(--shadow-glow)] hover:scale-[1.02] transition"
              >
                <MessageCircle className="h-5 w-5" />
                Pedir pelo WhatsApp
              </a>
              <a
                href="https://www.instagram.com/irenecomidasaudavel_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-background/30 px-6 py-4 text-sm font-medium hover:bg-background/10 transition"
              >
                <Instagram className="h-4 w-4" /> Ver cardápio no Instagram
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-background/70">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> Sem conservantes</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> Porções equilibradas</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl" />
            <img
              src={heroImg}
              alt="Marmitas fitness em Fortaleza preparadas com ingredientes frescos e naturais"
              width={1536}
              height={1280}
              className="relative rounded-[2rem] shadow-[var(--shadow-glow)] object-cover aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: "Máxima Nutrição", desc: "Ingredientes selecionados da estação para garantir o melhor para seu corpo." },
              { icon: Heart, title: "Sabor de Casa", desc: "Temperos naturais e afeto em cada porção, como se você tivesse feito." },
              { icon: Clock, title: "Mais Tempo Livre", desc: "Esqueça o fogão. Suas refeições ficam prontas em minutos." },
              { icon: Truck, title: "Praticidade na Porta", desc: "Logística refrigerada em Fortaleza para manter o frescor absoluto." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card p-6 hover:shadow-[var(--shadow-soft)] transition">
                <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Linhas */}
      <section className="py-24" style={{ background: "var(--gradient-leaf)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-accent-foreground/70">Nossas linhas</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-primary">
              O equilíbrio perfeito para<br />cada momento do seu dia.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Escolha entre o foco total na dieta ou uma experiência gastronômica saudável e sofisticada.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {[
              {
                img: meal2,
                tag: "Linha Fitness",
                name: "Energia e Definição",
                desc: "Otimize seus resultados com proteínas magras e carboidratos complexos na medida exata para sua performance.",
                bullets: ["Acelere seu metabolismo", "Controle calórico preciso", "Variedade semanal"],
                cta: "Garantir minha dieta",
                alt: "Prato da linha fitness Irene com frango grelhado e vegetais frescos"
              },
              {
                img: meal1,
                tag: "Linha Gourmet",
                name: "Alta Gastronomia Saudável",
                desc: "Desfrute de pratos autorais que provam que comer bem pode ser uma experiência de puro prazer e sofisticação.",
                bullets: ["Ingredientes nobres", "Técnicas de chef", "Sabor surpreendente"],
                cta: "Experimentar o Gourmet",
                alt: "Prato gourmet saudável Irene com apresentação sofisticada"
              },
            ].map((m) => (
              <article key={m.name} className="group rounded-3xl overflow-hidden bg-card border border-border shadow-[var(--shadow-soft)] flex flex-col">
                <div className="overflow-hidden aspect-[16/10]">
                  <img src={m.img} alt={m.alt} width={800} height={500} loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-accent-foreground/70">{m.tag}</span>
                  <h3 className="mt-2 font-display text-3xl font-semibold text-primary">{m.name}</h3>
                  <p className="mt-3 text-muted-foreground">{m.desc}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {m.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> {b}</li>
                    ))}
                  </ul>
                  <a href={waLink(`Olá Irene! ${m.cta} 💚`)} target="_blank" rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition">
                    <MessageCircle className="h-4 w-4" /> {m.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Combos */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-accent-foreground/70">Combos & unidades</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-primary">
              Planejamento inteligente para<br />sua semana inteira.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Garanta sua tranquilidade alimentar com planos que se adaptam à sua necessidade e geram economia real.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary/60">Tamanhos:</span>
              {["250g", "350g", "400g", "550g"].map((size) => (
                <span key={size} className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Iniciante", subtitle: "Unidade", desc: "Ideal para testar nosso tempero e se apaixonar pela qualidade.", highlight: false, cta: "Pedir agora" },
              { title: "Semanal", subtitle: "7 marmitas", desc: "Uma semana de foco total e zero preocupação com o mercado.", highlight: false, cta: "Ativar plano" },
              { title: "Quinzena", subtitle: "15 marmitas", desc: "O equilíbrio perfeito entre variedade e economia para sua rotina.", highlight: true, cta: "Melhor Custo-Benefício" },
              { title: "Mensal", subtitle: "30 marmitas", desc: "Transformação completa: 30 dias de alimentação de alta performance.", highlight: false, cta: "Mudar minha vida" },
            ].map((c) => (
              <div key={c.title}
                className={`relative rounded-3xl p-7 border transition flex flex-col ${c.highlight ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]" : "bg-card border-border hover:shadow-[var(--shadow-soft)]"}`}>
                {c.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold">Mais pedido</span>
                )}
                <div className={`text-xs uppercase tracking-widest ${c.highlight ? "text-accent" : "text-accent-foreground/70"}`}>{c.title}</div>
                <div className="mt-3 font-display text-4xl font-semibold">{c.subtitle}</div>
                <p className={`mt-3 text-sm flex-1 ${c.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.desc}</p>
                <a href={waLink(`Olá Irene! ${c.cta} 🥗`)} target="_blank" rel="noopener noreferrer"
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${c.highlight ? "bg-whatsapp text-whatsapp-foreground hover:opacity-90" : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"}`}>
                  <MessageCircle className="h-4 w-4" /> {c.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ✨ Combos podem misturar pratos das linhas <strong className="text-primary">Fitness</strong> e <strong className="text-primary">Gourmet</strong>.
          </p>
        </div>
      </section>

      {/* Nutritional Plan Section */}
      <section className="py-24 bg-card border-y border-border overflow-hidden relative">
        <Leaf className="leaf-premium animate-float -bottom-20 -right-20 w-80 h-80 rotate-12 opacity-5" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-accent/10 blur-2xl" />
              <div className="relative rounded-3xl border border-border bg-background p-8 sm:p-12 shadow-[var(--shadow-soft)]">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                  <ClipboardCheck className="h-7 w-7" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary leading-tight">
                  Seu plano alimentar,<br />nossa execução.
                </h2>
                <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                  Já tem um acompanhamento nutricional? Nós preparamos suas marmitas seguindo exatamente as gramaturas e combinações do seu plano.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    "Pesagem rigorosa de cada ingrediente",
                    "Personalização total do cardápio",
                    "Foco nos seus objetivos de saúde",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-primary/80">
                      <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest text-accent-foreground/70">Personalização Total</span>
              <h3 className="mt-4 font-display text-4xl font-semibold text-primary">Você nos mostra o plano, nós fazemos o resto.</h3>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Sabemos que seguir uma dieta exige disciplina. Para facilitar sua rotina, trabalhamos em cima do seu planejamento alimentar personalizado.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Basta nos enviar uma foto ou PDF do seu plano e definiremos juntos as melhores opções para suas marmitas da semana.
              </p>
              <a href={waLink("Olá Irene! Tenho um plano alimentar e gostaria de fazer minhas marmitas com base nele 🥗")} target="_blank" rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-base font-semibold hover:bg-accent hover:text-accent-foreground transition">
                <MessageCircle className="h-5 w-5" /> Enviar meu plano alimentar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-primary">Tranquilidade em 3 passos</h2>
          <p className="mt-4 text-muted-foreground">Logística simplificada para você nunca mais se preocupar com a próxima refeição.</p>
          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Chame no WhatsApp", d: "Veja o cardápio da semana e escolha seus pratos." },
              { n: "02", t: "Combine a entrega", d: "Definimos dia e horário que melhor te atendem." },
              { n: "03", t: "Receba e aproveite", d: "Marmitas frescas direto na sua porta. É só esquentar." },
            ].map((s) => (
              <div key={s.n} className="text-left">
                <div className="font-display text-6xl text-accent/60">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Background Decorative Leaves */}
        <Leaf className="leaf-premium animate-float -top-10 -left-10 w-64 h-64 -rotate-12" />
        <Leaf className="leaf-premium animate-float top-1/4 -right-12 w-48 h-48 rotate-[140deg]" style={{ animationDelay: "-2s" }} />
        <Leaf className="leaf-premium animate-float -bottom-16 left-1/3 w-40 h-40 rotate-45" style={{ animationDelay: "-5s" }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-background">
          <h2 className="font-display text-4xl sm:text-6xl font-semibold leading-tight">
            Pronta pra comer bem<br />
            <em className="not-italic text-accent">sem complicação?</em>
          </h2>
          <p className="mt-6 text-background/80 text-lg max-w-xl mx-auto">
            Faça seu pedido agora pelo WhatsApp e receba o cardápio completo da semana.
          </p>
          <a
            href={waLink("Olá Irene! Quero receber o cardápio da semana 💚")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-whatsapp text-whatsapp-foreground px-8 py-5 text-lg font-semibold shadow-[var(--shadow-glow)] hover:scale-[1.02] transition"
          >
            <MessageCircle className="h-5 w-5" /> Falar com a Irene
          </a>
        </div>
      </section>


      {/* Floating WhatsApp */}
      <a
        href={waLink("Olá Irene! Quero fazer um pedido 💚")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir pelo WhatsApp"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-whatsapp text-whatsapp-foreground shadow-[var(--shadow-glow)] hover:scale-110 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      {/* Footer */}
      <footer className="bg-primary py-12 text-primary-foreground/60 border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-accent" />
              <span className="font-display text-xl font-semibold text-primary-foreground">Irene Comida Saudável</span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="https://www.instagram.com/irenecomidasaudavel_/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent transition">
                <Instagram className="h-4 w-4" /> @irenecomidasaudavel_
              </a>
              <a href={waLink("Olá Irene!")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent transition">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <span className="text-xs opacity-50">Fortaleza · CE</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-primary-foreground/5 pt-8 text-sm">
            <p>
              © {new Date().getFullYear()} Irene Comida Saudável. Todos os direitos reservados.
            </p>
            <p>
              Desenvolvido por <a href="https://kayohancostadev.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline transition">Kayohan Costa</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Leaf, Check } from "lucide-react";
import { Dish } from "@/lib/dishes";

const WHATSAPP = "5585996565697";
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  showWaButton?: boolean;
  waText?: string;
}

interface QuickOption {
  label: string;
  nextStep: string;
  waText?: string;
  scrollToMenu?: boolean;
}

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [quickOptions, setQuickOptions] = useState<QuickOption[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(true); // Pulse badge control
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Olá! Sou a Assistente Virtual da Irene Comida Saudável. 🌱 Tudo bem?\n\nGostaria de bater um papo livre, tirar dúvidas ou quer que eu te guie passo a passo para montar o seu kit saudável perfeito?"
        }
      ]);
      setQuickOptions([
        { label: "📦 Montar meu Kit", nextStep: "wizard_step_1" },
        { label: "Perder Peso 🏃‍♂️", nextStep: "lose_weight" },
        { label: "Ganhar Massa 💪", nextStep: "gain_muscle" },
        { label: "Ver Cardápio 🍽️", nextStep: "show_menu", scrollToMenu: true }
      ]);
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Handle Conversational State Machine (Interactive Wizard & Dialog Steps)
  const handleQuickOptionClick = (option: QuickOption) => {
    // Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: option.label }]);
    setQuickOptions([]);

    // Scroll IMMEDIATELY to make the UI feel snappy and responsive!
    if (option.scrollToMenu) {
      document.getElementById("cardapio-interativo")?.scrollIntoView({ behavior: "smooth" });
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (option.scrollToMenu) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "Perfeito! Rolei a página para você ver o nosso cardápio de pratos e combos completos abaixo. Escolha os seus favoritos no carrinho! Qualquer dúvida, estou por aqui! 💚"
          }
        ]);
        setQuickOptions([
          { label: "📦 Montar meu Kit", nextStep: "wizard_step_1" },
          { label: "Falar com a Irene 💬", nextStep: "whatsapp_direct" }
        ]);
        return;
      }

      // Check Wizard Steps
      if (option.nextStep.startsWith("wizard_step_2__")) {
        const chosenPlan = option.nextStep.replace("wizard_step_2__", "");
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Perfeito! Selecionado: **${chosenPlan}**. 🍽️\n\n**Passo 2:** Qual das nossas linhas de produtos deliciosas você gostaria de incluir no seu kit?`
          }
        ]);
        setQuickOptions([
          { label: "Linha Fitness 🏃‍♂️", nextStep: `wizard_step_3__${chosenPlan}__Linha Fitness` },
          { label: "Linha Gourmet 🥩", nextStep: `wizard_step_3__${chosenPlan}__Linha Gourmet` },
          { label: "Sopas & Caldos 🥣", nextStep: `wizard_step_3__${chosenPlan}__Sopas & Caldos` },
          { label: "Sobremesas Fit 🧁", nextStep: `wizard_step_3__${chosenPlan}__Sobremesas Fit` },
          { label: "Detox 🍏", nextStep: `wizard_step_3__${chosenPlan}__Detox` }
        ]);
        return;
      }

      if (option.nextStep.startsWith("wizard_step_3__")) {
        const parts = option.nextStep.replace("wizard_step_3__", "").split("__");
        const chosenPlan = parts[0];
        const chosenLine = parts[1];
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Excelente! Linha definida: **${chosenLine}**. ⚖️\n\n**Passo 3:** Qual o tamanho de porção (gramatura) ideal para suas marmitas?`
          }
        ]);
        setQuickOptions([
          { label: "250g", nextStep: `wizard_step_4__${chosenPlan}__${chosenLine}__250g` },
          { label: "350g", nextStep: `wizard_step_4__${chosenPlan}__${chosenLine}__350g` },
          { label: "400g", nextStep: `wizard_step_4__${chosenPlan}__${chosenLine}__400g` },
          { label: "550g", nextStep: `wizard_step_4__${chosenPlan}__${chosenLine}__550g` }
        ]);
        return;
      }

      if (option.nextStep.startsWith("wizard_step_4__")) {
        const parts = option.nextStep.replace("wizard_step_4__", "").split("__");
        const chosenPlan = parts[0];
        const chosenLine = parts[1];
        const chosenPortion = parts[2];
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Ótimo! Gramatura definida: **${chosenPortion}**. 🌾\n\n**Passo 4:** Você possui alguma restrição ou preferência alimentar específica?`
          }
        ]);
        setQuickOptions([
          { label: "Sem Glúten 🌾", nextStep: `wizard_finish__${chosenPlan}__${chosenLine}__${chosenPortion}__Sem Glúten` },
          { label: "Sem Lactose 🥛", nextStep: `wizard_finish__${chosenPlan}__${chosenLine}__${chosenPortion}__Sem Lactose` },
          { label: "Vegano 🌱", nextStep: `wizard_finish__${chosenPlan}__${chosenLine}__${chosenPortion}__Vegano` },
          { label: "Low Carb 🥦", nextStep: `wizard_finish__${chosenPlan}__${chosenLine}__${chosenPortion}__Low Carb` },
          { label: "Nenhuma 👍", nextStep: `wizard_finish__${chosenPlan}__${chosenLine}__${chosenPortion}__Nenhuma` }
        ]);
        return;
      }

      if (option.nextStep.startsWith("wizard_finish__")) {
        const parts = option.nextStep.replace("wizard_finish__", "").split("__");
        const chosenPlan = parts[0];
        const chosenLine = parts[1];
        const chosenPortion = parts[2];
        const chosenRestriction = parts[3];

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Parabéns! 🎉 O seu kit saudável ideal está totalmente planejado:\n\n📦 **Resumo do seu Kit:**\n• **Plano:** ${chosenPlan}\n• **Linha:** ${chosenLine}\n• **Porção:** ${chosenPortion}\n• **Restrição/Preferência:** ${chosenRestriction}\n\nClique no botão abaixo para enviar essas configurações diretamente para a Irene no WhatsApp! Ela vai finalizar o seu pedido e definir o cardápio de pratos com você! 💚`,
            showWaButton: true,
            waText: `Olá Irene! Acabei de montar meu kit saudável personalizado no site:\n\n• Combo: ${chosenPlan}\n• Linha: ${chosenLine}\n• Porção: ${chosenPortion}\n• Restrição/Preferência: ${chosenRestriction}\n\nGostaria de finalizar meu pedido e escolher os pratos! 💚`
          }
        ]);
        setQuickOptions([
          { label: "Montar outro Kit 📦", nextStep: "wizard_step_1" },
          { label: "Ver Cardápio do Site 🍽️", nextStep: "show_menu", scrollToMenu: true }
        ]);
        return;
      }

      // Handle other standard paths
      switch (option.nextStep) {
        case "wizard_step_1":
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Perfeito! Vamos montar o seu Kit Saudável ideal juntos. 📦\n\n**Passo 1:** Qual dos nossos planos/combos abaixo melhor se adapta à sua rotina?"
            }
          ]);
          setQuickOptions([
            { label: "Iniciante (1 marmita)", nextStep: "wizard_step_2__Iniciante (1 marmita)" },
            { label: "Semanal (7 marmitas)", nextStep: "wizard_step_2__Semanal (7 marmitas)" },
            { label: "Quinzena (15 marmitas)", nextStep: "wizard_step_2__Quinzena (15 marmitas)" },
            { label: "Mensal (30 marmitas)", nextStep: "wizard_step_2__Mensal (30 marmitas)" }
          ]);
          break;

        case "lose_weight":
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Excelente! A nossa Linha Fitness é perfeita para quem quer perder peso de forma saudável e com comida deliciosa. 🏃‍♂️ Para quantos dias você precisa? Você já sabe a quantidade de marmitas ou quer que eu te sugira?"
            }
          ]);
          setQuickOptions([
            { label: "Já sei a quantidade", nextStep: "wizard_step_1" },
            { label: "Me sugira! 💡", nextStep: "suggest_kits" }
          ]);
          break;

        case "gain_muscle":
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Maravilhoso! Para ganho de massa, nossa Linha Gourmet e nossos pratos de alta proteína são ideais para apoiar a hipertrofia. 💪 Para quantos dias você planeja suas refeições? Já sabe a quantidade ou prefere uma sugestão?"
            }
          ]);
          setQuickOptions([
            { label: "Já sei a quantidade", nextStep: "wizard_step_1" },
            { label: "Me sugira! 💡", nextStep: "suggest_kits" }
          ]);
          break;

        case "suggest_kits":
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Recomendo muito o nosso Combo Semanal de 7 marmitas ou o nosso Combo Quinzena de 15 marmitas (que tem o melhor custo-benefício e você ganha frete grátis/desconto especial!). 💡 O que acha? Quer dar uma olhada nas opções do nosso cardápio ou quer montar o seu kit passo a passo?"
            }
          ]);
          setQuickOptions([
            { label: "📦 Montar meu Kit", nextStep: "wizard_step_1" },
            { label: "Ver Cardápio Completo 🍽️", nextStep: "show_menu", scrollToMenu: true },
            { label: "Falar com a Irene no WhatsApp 💬", nextStep: "whatsapp_direct" }
          ]);
          break;

        case "whatsapp_direct":
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Perfeito! Vou te encaminhar para falar diretamente com a Irene no WhatsApp. Lá ela vai te dar uma assessoria de pertinho para montar seu plano alimentar saudável! Clique no botão abaixo para iniciar: 👇",
              showWaButton: true,
              waText: "Olá Irene! Estava conversando com seu assistente no site e gostaria de montar meu pedido saudável de marmitas! 💚"
            }
          ]);
          break;

        default:
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Entendido! Como posso te ajudar a comer melhor hoje? Se quiser tirar dúvidas específicas ou agendar suas entregas, clique abaixo para falar diretamente no WhatsApp."
            }
          ]);
          setQuickOptions([
            { label: "Falar no WhatsApp 💬", nextStep: "whatsapp_direct" }
          ]);
          break;
      }
    }, 1000);
  };

  // Call OpenRouter with active dishes context
  const handleCustomQuestion = async (userText: string) => {
    setIsTyping(true);
    
    // Load local dishes from localStorage cache to give the AI active context!
    let dishesContext = "";
    try {
      const cached = localStorage.getItem("irene_dishes");
      if (cached) {
        const parsed = JSON.parse(cached) as Dish[];
        if (parsed.length > 0) {
          dishesContext = "Nossos pratos ativos em estoque hoje são: " + 
            parsed.map(d => `"${d.name}" (${d.category === "fitness" ? "Linha Fitness" : d.category === "gourmet" ? "Linha Gourmet" : "Sopa/Caldos"}, descrição: ${d.description}, calorias: ${d.nutritionalInfo.calories}kcal, proteínas: ${d.nutritionalInfo.protein}g)`).join(", ") + ".";
        }
      }
    } catch (e) {
      console.warn("Dishes cache not found, continuing without cache context.");
    }

    const systemPrompt = `Você é a IA da Irene Comida Saudável, uma empresa em Fortaleza que fornece marmitas fitness e gourmet caseiras de altíssima qualidade. 
Seu tom é sempre acolhedor, simpático, motivador e focado em saúde. 
Contexto dos pratos atuais do cardápio: ${dishesContext || "Fornecemos Linha Fitness para emagrecimento e Linha Gourmet rica em proteínas para ganho de massa."}

Nossas configurações e opções oficiais de cardápio são:
1. Planos/Combos de marmitas:
   - Iniciante (1 marmita)
   - Semanal (7 marmitas)
   - Quinzena (15 marmitas)
   - Mensal (30 marmitas)
2. Linhas de pratos deliciosas:
   - Linha Fitness (Foco em emagrecimento)
   - Linha Gourmet (Sabor requintado e alta proteína)
   - Sopas & Caldos (Refeições leves e reconfortantes)
   - Sobremesas Fit (Doces saudáveis sem açúcar/culpa)
   - Detox (Sucos e marmitas focadas em desintoxicação)
3. Tamanhos de porção disponíveis:
   - 250g (Leve / Perfeito para jantares ou dietas restritivas)
   - 350g (Tradicional / Nosso tamanho padrão ideal)
   - 400g (Reforçado / Perfeito para quem tem mais fome)
   - 550g (Hipertrofia / Ideal para ganho de massa bruto)
4. Restrições e preferências alimentares que atendemos:
   - Sem Glúten
   - Sem Lactose
   - Vegano
   - Low Carb

Se o cliente perguntar sobre essas especificações, explique de forma clara e amigável.
Se o cliente quiser comprar ou montar um combo, sugira que use o botão "Montar meu Kit" ou direcione-o a falar com a Irene no WhatsApp.
Nosso WhatsApp oficial é ${WHATSAPP}.

ATENÇÃO CRÍTICA: Se o cliente fizer perguntas altamente técnicas, personalizadas ou sensíveis (tais como: intolerâncias severas, alergias graves, planos alimentares médicos específicos descritos por nutricionistas detalhando gramas específicas de macros para reembalar, ou sobre frete/entrega especial), ou se você não souber responder com certeza, você DEVE responder de forma muito educada dizendo: "Essa é uma excelente pergunta e muito importante para a sua saúde/logística! Para te dar a melhor orientação e atenção pessoalizada de pertinho, vou te encaminhar para falar diretamente com a Irene no WhatsApp." e sugira que clique no botão verde que aparecerá no chat.`;

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const model = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

    if (!apiKey) {
      throw new Error("VITE_OPENROUTER_API_KEY is not defined in environments.");
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://irenecomidasaudavel.com.br",
          "X-Title": "Irene Comida Saudavel Chatbot",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText }
          ]
        })
      });

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          // Detect if response suggests going to WhatsApp or Irene
          const wantsWa = reply.toLowerCase().includes("whatsapp") || 
                           reply.toLowerCase().includes("irene") || 
                           reply.toLowerCase().includes("encaminhar");

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: reply,
              showWaButton: wantsWa,
              waText: `Olá Irene! Estava conversando com seu assistente no site sobre: "${userText}"`
            }
          ]);
          return;
        }
      }
      throw new Error("Falha ao obter resposta da API.");
    } catch (err) {
      console.warn("OpenRouter API limits hit, falling back to smart local assistant response.", err);
      setIsTyping(false);
      
      // Smart offline fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Que pergunta fantástica! Como se trata de um detalhe muito importante e personalizado para os seus objetivos, vou te encaminhar para falar diretamente com a Irene no WhatsApp. Ela vai adorar conversar com você e montar o cardápio perfeito! Clique no botão abaixo: 💚",
          showWaButton: true,
          waText: `Olá Irene! Quero tirar uma dúvida sobre marmitas saudáveis: "${userText}"`
        }
      ]);
    }
  };

  // Submit Text Input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: "user", text: userText }]);
    
    // Call Custom Prompt AI
    handleCustomQuestion(userText);
  };

  // Open Chat Widget
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[500px] bg-background/95 border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-6 duration-200 backdrop-blur-md">
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between text-primary-foreground border-b border-primary/20">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 rounded-full bg-secondary border border-background/25 flex items-center justify-center text-primary flex-shrink-0">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-whatsapp border-2 border-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm leading-tight text-white">Irene IA Assistente</h4>
                <span className="text-[10px] text-accent font-medium uppercase tracking-wider">Online e Saudável</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition cursor-pointer text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-secondary/5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                
                {/* Embedded dynamic WhatsApp button */}
                {msg.showWaButton && (
                  <a
                    href={waLink(msg.waText || "Olá Irene!")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-whatsapp hover:opacity-90 text-whatsapp-foreground px-4 py-2.5 text-xs font-bold shadow-md transition"
                  >
                    <MessageCircle className="h-4 w-4" /> Falar no WhatsApp com Irene
                  </a>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 w-[70px] shadow-sm animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Option Tags */}
          {quickOptions.length > 0 && (
            <div className="px-4 py-3 bg-secondary/20 border-t border-border flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-x-auto max-h-[120px]">
              {quickOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleQuickOptionClick(opt)}
                  className="bg-card hover:bg-primary hover:text-primary-foreground border border-border rounded-full px-3 py-1.5 text-xs font-semibold text-primary transition cursor-pointer shadow-sm whitespace-nowrap"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Footer */}
          <form onSubmit={handleSubmit} className="p-3 bg-card border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida sobre alimentação..."
              className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50 flex-shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Main Badge Button */}
      <button
        onClick={toggleChat}
        aria-label="Assistente Virtual de Comida Saudável"
        className="relative h-14 w-14 rounded-full bg-whatsapp text-whatsapp-foreground shadow-[var(--shadow-glow)] hover:scale-110 active:scale-95 transition flex items-center justify-center cursor-pointer group"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition duration-200" />
            {hasNewMessage && (
              <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-accent text-accent-foreground text-[10px] font-extrabold flex items-center justify-center shadow-lg border-2 border-background animate-bounce">
                1
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}

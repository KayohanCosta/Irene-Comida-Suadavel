import { useState, useMemo, useEffect } from "react";
import { 
  Leaf, 
  Search, 
  Plus, 
  Minus, 
  Info, 
  ShoppingBag, 
  Check, 
  MessageCircle, 
  X, 
  ChevronRight, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { COMBOS, Dish, Combo, getStoredDishes, fetchDishesFromSupabase } from "@/lib/dishes";

const WHATSAPP_NUMBER = "5585996565697";

interface MenuSectionProps {
  initialComboGoal?: number | null;
  onCloseComboGoal?: () => void;
}

export default function MenuSection({ initialComboGoal = null, onCloseComboGoal }: MenuSectionProps) {
  // STATE
  const [dishes, setDishes] = useState<Dish[]>(() => getStoredDishes());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeComboGoal, setActiveComboGoal] = useState<number | null>(initialComboGoal);
  
  // Cart state: { [dishId]: quantity }
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [globalSize, setGlobalSize] = useState<string>("350g");
  const [observation, setObservation] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeNutritionalDish, setActiveNutritionalDish] = useState<Dish | null>(null);

  // Sync initial combo goal if it changes from parent
  useEffect(() => {
    setActiveComboGoal(initialComboGoal);
  }, [initialComboGoal]);

  // Sync stored dishes on mount and window focus (real-time updates from admin tab)
  useEffect(() => {
    const refreshDishes = () => {
      // Immediate load from local cache for 0ms load speed
      setDishes(getStoredDishes());
      // Background sync from Supabase to revalidate in real-time
      fetchDishesFromSupabase().then(data => setDishes(data));
    };
    refreshDishes();
    window.addEventListener("focus", refreshDishes);
    return () => window.removeEventListener("focus", refreshDishes);
  }, []);

  // Derived Values
  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  // List of all unique dietary tags across all dishes
  const availableTags = ["Sem Glúten", "Sem Lactose", "Vegano", "Low Carb", "Proteico"];

  // Filter Dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category Filter
      if (selectedCategory !== "all" && dish.category !== selectedCategory) {
        return false;
      }

      // Search Term Filter (Name, description, tags, category)
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesTag = dish.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      // Dietary Tags Filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag => dish.tags.includes(tag));
        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  // Active combo info
  const activeCombo = useMemo(() => {
    if (activeComboGoal === null) return null;
    return COMBOS.find(c => c.quantity === activeComboGoal) || null;
  }, [activeComboGoal]);

  // Dynamic Suggestion based on current count (if no combo goal is pre-selected)
  const dynamicComboUpgrade = useMemo(() => {
    if (activeComboGoal !== null) return null;

    if (totalItems > 0 && totalItems < 7) {
      return { next: 7, name: "Semanal", diff: 7 - totalItems };
    } else if (totalItems >= 7 && totalItems < 15) {
      return { next: 15, name: "Quinzena", diff: 15 - totalItems };
    } else if (totalItems >= 15 && totalItems < 30) {
      return { next: 30, name: "Mensal", diff: 30 - totalItems };
    }
    return null;
  }, [totalItems, activeComboGoal]);

  // CART MUTATIONS
  const addToCart = (dishId: string) => {
    setCart((prev) => {
      const currentQty = prev[dishId] || 0;
      
      // If there is an active combo goal, don't rigidly lock but give warning if exceeded.
      return {
        ...prev,
        [dishId]: currentQty + 1
      };
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const currentQty = prev[dishId] || 0;
      if (currentQty <= 1) {
        const newCart = { ...prev };
        delete newCart[dishId];
        return newCart;
      }
      return {
        ...prev,
        [dishId]: currentQty - 1
      };
    });
  };

  const updateQty = (dishId: string, value: number) => {
    setCart((prev) => {
      if (value <= 0) {
        const newCart = { ...prev };
        delete newCart[dishId];
        return newCart;
      }
      return {
        ...prev,
        [dishId]: value
      };
    });
  };

  const clearCart = () => {
    setCart({});
    if (onCloseComboGoal) {
      onCloseComboGoal();
    } else {
      setActiveComboGoal(null);
    }
  };

  // Tag toggler
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Generate WhatsApp Message Link
  const waLink = () => {
    let comboTitle = "Marmitas Individuais";
    
    if (activeComboGoal !== null && activeCombo) {
      comboTitle = `Combo ${activeCombo.title} (${activeCombo.quantity} marmitas)`;
    } else {
      // Auto-detect based on quantity
      if (totalItems >= 30) {
        comboTitle = "Combo Mensal (30 marmitas)";
      } else if (totalItems >= 15) {
        comboTitle = "Combo Quinzena (15 marmitas)";
      } else if (totalItems >= 7) {
        comboTitle = "Combo Semanal (7 marmitas)";
      }
    }

    let itemsText = "";
    Object.entries(cart).forEach(([dishId, qty]) => {
      const dish = dishes.find(d => d.id === dishId);
      if (dish) {
        // Desserts don't usually have the meal gram sizes, but we can append global size to main dishes.
        const isDessert = dish.category === "sobremesas";
        const sizeInfo = isDessert ? "Sobremesa Fit" : `${globalSize}`;
        itemsText += `- *${qty}x* ${dish.name} (${sizeInfo})\n`;
      }
    });

    const msg = `Olá Irene! 💚 Vim pelo site e montei meu pedido personalizado:\n\n` +
      `⭐ *Plano selecionado:* ${comboTitle}\n\n` +
      `*Marmitas Escolhidas:*\n${itemsText}\n` +
      `*Total de Refeições:* ${totalItems} marmitas\n` +
      `${observation.trim() ? `\n*Observações:* \n"${observation.trim()}"\n` : ""}\n` +
      `Aguardando confirmação para entrega em Fortaleza! 🚗💨`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  // Handle direct combo selection in menu
  const selectComboGoal = (qty: number) => {
    setActiveComboGoal(qty);
    // Suggest clearing cart if current items exceed or differ significantly
  };

  return (
    <section id="cardapio-interativo" className="py-24 relative overflow-hidden bg-background">
      {/* Background Leaves */}
      <Leaf className="leaf-premium animate-float top-1/4 -right-16 w-56 h-56 rotate-[120deg]" />
      <Leaf className="leaf-premium animate-float bottom-20 -left-16 w-48 h-48 -rotate-[35deg]" style={{ animationDelay: "-4s" }} />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest border border-primary/10 mb-4">
            <Leaf className="h-3.5 w-3.5" /> Praticidade Nutritiva
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-primary">
            Monte seu Cardápio Semanal
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Selecione suas marmitas favoritas abaixo, acompanhe os nutrientes e envie seu pedido de combo diretamente para o WhatsApp!
          </p>
        </div>

        {/* Combo Tracker Widget */}
        <div className="mb-12 max-w-4xl mx-auto">
          {activeComboGoal !== null ? (
            <div className="rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-md p-6 sm:p-8 relative overflow-hidden shadow-[var(--shadow-soft)]">
              {/* Progress Glow */}
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Modo Assistido</span>
                  <h3 className="font-display text-2xl font-semibold text-primary">
                    Montando seu Combo {activeCombo?.title} ({activeComboGoal} marmitas)
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-primary">
                    {totalItems} <span className="text-sm font-body font-normal text-muted-foreground">de {activeComboGoal}</span>
                  </span>
                  <button 
                    onClick={() => {
                      if (onCloseComboGoal) onCloseComboGoal();
                      setActiveComboGoal(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition"
                    title="Mudar de Combo"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-whatsapp transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (totalItems / activeComboGoal) * 100)}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>
                  {totalItems < activeComboGoal ? (
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-accent-foreground" />
                      Faltam exatamente <strong>{activeComboGoal - totalItems}</strong> marmitas para completar seu combo!
                    </span>
                  ) : totalItems === activeComboGoal ? (
                    <span className="flex items-center gap-1.5 text-whatsapp font-medium">
                      <Check className="h-4 w-4" />
                      Seu combo está completo! Pronto para finalizar no WhatsApp. 💚
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-accent-foreground font-medium">
                      <AlertCircle className="h-4 w-4" />
                      Você adicionou <strong>{totalItems - activeComboGoal}</strong> marmitas a mais do que o plano selecionado.
                    </span>
                  )}
                </p>

                {totalItems === activeComboGoal && (
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-whatsapp text-whatsapp-foreground px-5 py-2 text-xs font-semibold hover:opacity-90 transition shadow-md"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Revisar e Enviar Pedido
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <p className="text-muted-foreground mb-4">
                💡 <strong>Dica de Economia:</strong> Escolha um combo abaixo para guiar sua seleção e garantir o menor preço por unidade!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {COMBOS.map((combo) => (
                  <button
                    key={combo.id}
                    onClick={() => selectComboGoal(combo.quantity)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-primary px-4 py-2 text-xs font-semibold transition"
                  >
                    {combo.title} ({combo.quantity} {combo.quantity === 1 ? 'marmita' : 'marmitas'})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-soft)] mb-8">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar pratos ou ingredientes (ex: salmão, abóbora...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            {/* Category Tabs */}
            <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end">
              {[
                { id: "all", label: "Todos os pratos" },
                { id: "fitness", label: "Linha Fitness" },
                { id: "gourmet", label: "Linha Gourmet" },
                { id: "sopas", label: "Sopas & Caldos" },
                { id: "sobremesas", label: "Sobremesas Fit" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-border text-secondary-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions Toggles */}
          <div className="mt-6 pt-6 border-t border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
              Restrições ou preferências alimentares:
            </span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-accent border-accent text-accent-foreground shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {isActive && <Check className="h-3.5 w-3.5" />}
                    {tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-primary font-semibold hover:underline px-2"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-3xl">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-primary">Nenhum prato encontrado</h3>
            <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto">
              Experimente alterar os filtros de restrição ou busque por outra palavra-chave.
            </p>
          </div>
        )}

        {/* Dishes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => {
            const quantity = cart[dish.id] || 0;
            return (
              <article 
                key={dish.id} 
                className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border shadow-[var(--shadow-soft)] hover:shadow-lg transition-all duration-300"
              >
                {/* Image & Tags */}
                <div className="relative overflow-hidden aspect-[4/3] bg-muted">
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1 max-w-[80%]">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      dish.category === 'fitness' 
                        ? 'bg-secondary text-primary border border-primary/10' 
                        : dish.category === 'gourmet' 
                          ? 'bg-accent/80 text-accent-foreground backdrop-blur'
                          : 'bg-primary text-primary-foreground'
                    }`}>
                      {dish.category === 'fitness' ? 'Fitness' : dish.category === 'gourmet' ? 'Gourmet' : dish.category === 'sopas' ? 'Sopa/Caldo' : 'Sobremesa Fit'}
                    </span>
                  </div>
                  
                  {/* Quick Info Button */}
                  <button
                    onClick={() => setActiveNutritionalDish(dish)}
                    className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur text-white flex items-center justify-center transition"
                    title="Ver Tabela Nutricional"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {dish.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-muted-foreground/80 bg-secondary/50 rounded-md px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display text-xl font-semibold text-primary group-hover:text-accent-foreground transition">
                      {dish.name}
                    </h3>
                    
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {dish.description}
                    </p>
                  </div>

                  {/* Quantity Controller & Nutrition Summary */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
                    
                    {/* Mini nutrition label */}
                    <div className="text-[10px] text-muted-foreground">
                      <span className="font-semibold text-primary">{dish.nutritionalInfo.calories} kcal</span>
                      <span className="mx-1">•</span>
                      <span>{dish.nutritionalInfo.protein}g P</span>
                    </div>

                    {/* Controller */}
                    {quantity > 0 ? (
                      <div className="inline-flex items-center rounded-full bg-secondary border border-border p-1 shadow-sm">
                        <button
                          onClick={() => removeFromCart(dish.id)}
                          className="h-7 w-7 rounded-full bg-background hover:bg-border text-primary flex items-center justify-center transition active:scale-95"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-primary">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(dish.id)}
                          className="h-7 w-7 rounded-full bg-background hover:bg-border text-primary flex items-center justify-center transition active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(dish.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground px-4 py-2 text-xs font-semibold transition"
                      >
                        <Plus className="h-3.5 w-3.5" /> Adicionar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-4 shadow-[var(--shadow-glow)] hover:scale-105 active:scale-95 transition"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center border-2 border-primary">
              {totalItems}
            </span>
          </div>
          <span className="font-semibold text-sm hidden sm:inline">Ver minha Sacola</span>
        </button>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-background shadow-2xl flex flex-col h-full border-l border-border">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl font-bold text-primary">Minha Sacola</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full hover:bg-border transition text-muted-foreground hover:text-primary"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                
                {/* Active Combo status inside cart */}
                {activeComboGoal !== null && (
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-xs">
                    <p className="font-semibold text-primary mb-1">
                      🎯 Meta do Combo: {activeComboGoal} marmitas
                    </p>
                    <p className="text-muted-foreground">
                      Você selecionou <strong>{totalItems}</strong> refeições.
                      {totalItems < activeComboGoal ? (
                        <span> Faltam <strong>{activeComboGoal - totalItems}</strong> para completar seu plano.</span>
                      ) : totalItems === activeComboGoal ? (
                        <span className="text-whatsapp"> Seu plano está completo! 🎉</span>
                      ) : (
                        <span className="text-accent-foreground"> Meta ultrapassada em {totalItems - activeComboGoal}.</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Free choice dynamic combo upsell feedback */}
                {dynamicComboUpgrade && (
                  <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20 text-xs">
                    <p className="font-semibold text-accent-foreground mb-1">
                      🎁 Oportunidade de Desconto!
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Você está com {totalItems} {totalItems === 1 ? 'marmita' : 'marmitas'}. 
                      Adicione mais <strong>{dynamicComboUpgrade.diff}</strong> para atingir o <strong>Combo {dynamicComboUpgrade.name} ({dynamicComboUpgrade.next} marmitas)</strong> e garantir economia!
                    </p>
                    <button 
                      onClick={() => selectComboGoal(dynamicComboUpgrade.next)}
                      className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      Ativar meta do combo <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Selected Items List */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Pratos Escolhidos
                  </span>

                  {Object.entries(cart).map(([dishId, qty]) => {
                    const dish = dishes.find(d => d.id === dishId);
                    if (!dish) return null;
                    return (
                      <div key={dishId} className="flex gap-4 p-3 bg-card border border-border rounded-2xl hover:shadow-sm transition">
                        <img 
                          src={dish.image} 
                          alt={dish.name} 
                          className="h-16 w-16 rounded-xl object-cover bg-muted flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="font-display text-sm font-semibold text-primary truncate">
                              {dish.name}
                            </h4>
                            <span className="text-[10px] text-muted-foreground">
                              {dish.category === "sobremesas" ? "Sobremesa" : `Aprox. ${dish.nutritionalInfo.calories} kcal`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Qtd:
                            </span>
                            
                            {/* Controller */}
                            <div className="inline-flex items-center rounded-full bg-secondary p-0.5">
                              <button
                                onClick={() => removeFromCart(dishId)}
                                className="h-6 w-6 rounded-full bg-background hover:bg-border text-primary flex items-center justify-center transition"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-primary">
                                {qty}
                              </span>
                              <button
                                onClick={() => addToCart(dishId)}
                                className="h-6 w-6 rounded-full bg-background hover:bg-border text-primary flex items-center justify-center transition"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Marmita Size Selector (Not for desserts) */}
                <div className="pt-4 border-t border-border">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Tamanho das Marmitas (Peso)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["250g", "350g", "400g", "550g"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setGlobalSize(size)}
                        className={`rounded-xl py-2 text-xs font-semibold border transition cursor-pointer text-center ${
                          globalSize === size
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-1.5 leading-normal">
                    *Tamanho aplicável aos pratos principais (Fitness, Gourmet e Sopas).
                  </span>
                </div>

                {/* Observation Field */}
                <div className="pt-4 border-t border-border">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Observações ou Ajustes (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Sem cebola nas marmitas; Por favor enviar talheres descartáveis; Quero duplicar os brócolis..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="w-full bg-background border border-border rounded-2xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-border bg-secondary/10">
                <div className="flex items-center justify-between mb-4 text-sm font-semibold text-primary">
                  <span>Total de Marmitas:</span>
                  <span className="font-display text-lg">{totalItems} unidades</span>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={waLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-whatsapp text-whatsapp-foreground py-4 text-sm font-bold shadow-md hover:scale-[1.01] transition"
                  >
                    <MessageCircle className="h-5 w-5" /> Enviar Pedido no WhatsApp
                  </a>
                  
                  <button
                    onClick={clearCart}
                    className="w-full py-2.5 text-xs text-muted-foreground hover:text-destructive transition font-medium"
                  >
                    Limpar Sacola
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Nutritional Info Detail Modal */}
      {activeNutritionalDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveNutritionalDish(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-background border border-border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Image */}
            <div className="h-44 bg-muted relative">
              <img 
                src={activeNutritionalDish.image} 
                alt={activeNutritionalDish.name} 
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setActiveNutritionalDish(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Tabela Nutricional (Porção Média)
              </span>
              <h3 className="font-display text-xl font-bold text-primary mt-1 mb-4 leading-tight">
                {activeNutritionalDish.name}
              </h3>

              {/* Nutrition Grid */}
              <div className="grid grid-cols-4 gap-2 text-center mb-6">
                <div className="bg-secondary/40 rounded-xl p-2.5 border border-primary/5">
                  <div className="text-lg font-bold text-primary font-display">
                    {activeNutritionalDish.nutritionalInfo.calories}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-semibold">
                    kcal
                  </div>
                </div>
                <div className="bg-secondary/40 rounded-xl p-2.5 border border-primary/5">
                  <div className="text-lg font-bold text-primary font-display">
                    {activeNutritionalDish.nutritionalInfo.protein}g
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-semibold">
                    Proteína
                  </div>
                </div>
                <div className="bg-secondary/40 rounded-xl p-2.5 border border-primary/5">
                  <div className="text-lg font-bold text-primary font-display">
                    {activeNutritionalDish.nutritionalInfo.carbs}g
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-semibold">
                    Carb
                  </div>
                </div>
                <div className="bg-secondary/40 rounded-xl p-2.5 border border-primary/5">
                  <div className="text-lg font-bold text-primary font-display">
                    {activeNutritionalDish.nutritionalInfo.fat}g
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-semibold">
                    Gordura
                  </div>
                </div>
              </div>

              {/* Ingredients / Details */}
              <div className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-4">
                <p>
                  🥗 <strong>Ingredientes e Preparo:</strong> Nossos pratos são preparados com temperos 100% naturais, sem adição de conservantes ou óleos refinados. Usamos apenas sal rosa/marinho e azeite extra virgem.
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {activeNutritionalDish.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-semibold text-accent-foreground bg-accent/25 rounded px-1.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveNutritionalDish(null)}
                className="mt-6 w-full py-3 bg-secondary text-primary font-semibold text-xs rounded-xl hover:bg-border transition cursor-pointer text-center"
              >
                Voltar ao Cardápio
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

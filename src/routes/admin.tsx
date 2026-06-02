import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Leaf,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Globe,
  RotateCcw,
  Lock,
  TrendingUp,
  Flame,
  Dumbbell,
  Check,
  X,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import {
  Dish,
  fetchDishesFromSupabase,
  saveDishToSupabase,
  deleteDishFromSupabase,
  resetDishesInSupabase
} from "@/lib/dishes";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Painel Administrativo | Irene Comida Saudável" },
      { name: "robots", content: "noindex, nofollow" }
    ]
  })
});



function AdminPage() {
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // CRUD States
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<"fitness" | "gourmet" | "sopas" | "sobremesas">("fitness");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formCalories, setFormCalories] = useState(350);
  const [formProtein, setFormProtein] = useState(30);
  const [formCarbs, setFormCarbs] = useState(30);
  const [formFat, setFormFat] = useState(10);
  const [formImage, setFormImage] = useState("");

  // Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // AI Generator States
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Load state on mount
  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem("irene_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    // Fetch from Supabase (with fallback to local storage cache)
    fetchDishesFromSupabase().then(data => setDishes(data));
  }, []);

  // Show a custom premium toast
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // HANDLE LOGIN WITH SUPABASE AUTH
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        setIsAuthenticated(true);
        sessionStorage.setItem("irene_admin_auth", "true");
        showToast("Acesso concedido! Bem-vinda, Irene. 💚", "success");
      }
    } catch (err: any) {
      setLoginError(err.message || "E-mail ou senha incorretos no Supabase.");
      showToast("Credenciais inválidas.", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("irene_admin_auth");
    showToast("Sessão encerrada com sucesso.", "info");
  };

  // OPEN NEW PRODUCT FORM
  const handleOpenAddForm = () => {
    setEditingDish(null);
    setFormName("");
    setFormDescription("");
    setFormCategory("fitness");
    setFormTags([]);
    setFormCalories(350);
    setFormProtein(30);
    setFormCarbs(30);
    setFormFat(10);
    setFormImage("");
    setIsFormOpen(true);
  };

  // OPEN EDIT FORM PRE-POPULATED
  const handleOpenEditForm = (dish: Dish) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormDescription(dish.description);
    setFormCategory(dish.category);
    setFormTags(dish.tags);
    setFormCalories(dish.nutritionalInfo.calories);
    setFormProtein(dish.nutritionalInfo.protein);
    setFormCarbs(dish.nutritionalInfo.carbs);
    setFormFat(dish.nutritionalInfo.fat);
    setFormImage(dish.image);
    setIsFormOpen(true);
  };

  // TAG CHECKBOX TOGGLER
  const toggleFormTag = (tag: string) => {
    setFormTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // FILE LOADER FROM DEVICE WITH AUTOMATIC COMPRESSION
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast("Processando e otimizando imagem... ⚙️", "info");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result) {
        const img = new Image();
        img.src = result as string;
        img.onload = () => {
          // Define target max dimension (e.g. 800px width or height is perfect for web menu cards)
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          // Create dynamic canvas for resizing
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            // Export as compressed JPEG with 75% quality (excellent sharpness, very small size)
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
            setFormImage(compressedBase64);
            showToast("Imagem carregada e otimizada com sucesso! 📸✨", "success");
          } else {
            // Fallback in case canvas fails
            setFormImage(result as string);
            showToast("Imagem carregada do dispositivo! 📸", "success");
          }
        };
        img.onerror = () => {
          showToast("Erro ao processar imagem. Tente outro arquivo.", "error");
        };
      }
    };
    reader.onerror = () => {
      showToast("Erro ao ler o arquivo selecionado.", "error");
    };
    reader.readAsDataURL(file);
  };

  // GENERATE DISH USING OPENROUTER AI
  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      showToast("Por favor, digite uma ideia para a IA criar.", "error");
      return;
    }

    setIsAiLoading(true);
    showToast("Gerando prato saudável com IA... 🧑‍🍳", "info");

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const model = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

    if (!apiKey) {
      showToast("Configuração ausente: insira VITE_OPENROUTER_API_KEY no arquivo .env", "error");
      setIsAiLoading(false);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://irenecomidasaudavel.com.br",
          "X-Title": "Irene Comida Saudavel",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `Você é uma chef profissional e nutricionista especialista em alimentação saudável. Sua tarefa é criar um prato único de comida saudável baseando-se no desejo do usuário.
Você DEVE retornar estritamente um objeto JSON com o seguinte formato (sem marcações markdown \`\`\`json ou texto extra explicativo, apenas o JSON bruto de forma que possa ser parseado via JSON.parse):
{
  "name": "Nome curto e super apetitoso do prato",
  "description": "Uma descrição irresistível detalhando o prato e ingredientes (máximo 200 caracteres)",
  "category": "fitness", "gourmet", "sopas" ou "sobremesas" (escolha a mais apropriada),
  "tags": ["Tag1", "Tag2"] (ex: 'Sem Glúten', 'Sem Lactose', 'Vegano', 'Low Carb', 'Proteico' - escolha entre 1 e 3 tags adequadas),
  "nutritionalInfo": {
    "calories": calorias_em_kcal_numero,
    "protein": proteinas_em_g_numero,
    "carbs": carboidratos_em_g_numero,
    "fat": gorduras_em_g_numero
  }
}`
            },
            {
              role: "user",
              content: `Gere um prato com base em: "${aiPrompt}"`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API OpenRouter: status ${response.status}`);
      }

      const resData = await response.json();
      const content = resData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Resposta da IA vazia.");
      }

      // Clean response in case the model wraps it in markdown blocks
      let cleanedJson = content.trim();
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.replace(/```json/g, "").replace(/```/g, "").trim();
      } else if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.replace(/```/g, "").trim();
      }

      const generatedDish = JSON.parse(cleanedJson);

      // Populate form fields
      setFormName(generatedDish.name || "");
      setFormDescription(generatedDish.description || "");
      setFormCategory(generatedDish.category || "fitness");
      setFormTags(generatedDish.tags || []);
      setFormCalories(Number(generatedDish.nutritionalInfo?.calories) || 350);
      setFormProtein(Number(generatedDish.nutritionalInfo?.protein) || 30);
      setFormFat(Number(generatedDish.nutritionalInfo?.fat) || 10);

      showToast("Prato criado com sucesso pela Inteligência Artificial! 🪄✨", "success");
      setIsAiPanelOpen(false);
      setAiPrompt("");
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      showToast("Falha ao gerar prato com IA. Tente novamente.", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  // SUBMIT SAVE (CREATE OR EDIT)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formDescription.trim()) {
      showToast("Por favor, preencha o nome e a descrição.", "error");
      return;
    }

    // Default image if empty
    let finalImage = formImage.trim();
    if (!finalImage) {
      // Fallback placeholder images from assets or high quality unsplash food photos
      if (formCategory === "fitness") finalImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60";
      else if (formCategory === "gourmet") finalImage = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=60";
      else if (formCategory === "sopas") finalImage = "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=60";
      else finalImage = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=60";
    }

    const dishData: Dish = {
      id: editingDish ? editingDish.id : `dish-${Date.now()}`,
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      tags: formTags,
      nutritionalInfo: {
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
      },
      image: finalImage,
    };

    // Save to Supabase (updating local cache automatically)
    saveDishToSupabase(dishData).then((updated) => {
      setDishes(updated);
      setIsFormOpen(false);
      showToast(
        editingDish
          ? `Prato "${formName}" editado com sucesso! ✨`
          : `Novo prato "${formName}" cadastrado com sucesso! ✨`,
        "success"
      );
    });
  };

  // DELETE PRODUCT
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Tem certeza absoluta de que deseja excluir o prato "${name}"?`)) {
      deleteDishFromSupabase(id).then((updated) => {
        setDishes(updated);
        showToast(`Prato "${name}" excluído do cardápio.`, "info");
      });
    }
  };

  // RESET DATABASE
  const handleResetDatabase = () => {
    if (window.confirm("Deseja restaurar o cardápio padrão com os 15 pratos iniciais no banco de dados? Isso apagará todas as modificações e novos pratos cadastrados no Supabase.")) {
      resetDishesInSupabase().then((reset) => {
        setDishes(reset);
        showToast("Cardápio padrão restaurado com sucesso! 🌿", "success");
      });
    }
  };

  // Statistics Computations
  const stats = {
    total: dishes.length,
    fitness: dishes.filter(d => d.category === "fitness").length,
    gourmet: dishes.filter(d => d.category === "gourmet").length,
    sopas: dishes.filter(d => d.category === "sopas").length,
    sobremesas: dishes.filter(d => d.category === "sobremesas").length,
  };

  // IF NOT AUTHENTICATED, SHOW BEAUTIFUL LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decors */}
        <Leaf className="leaf-premium animate-float top-20 -left-12 w-48 h-48 -rotate-45" />
        <Leaf className="leaf-premium animate-float bottom-10 right-12 w-56 h-56 rotate-[160deg] opacity-5" />

        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-[var(--shadow-glow)] relative z-10">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-primary">Acesso Restrito</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Painel Administrativo da Irene Comida Saudável
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                E-mail Administrativo
              </label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full bg-background border border-border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            {loginError && (
              <p className="text-xs font-medium text-destructive flex items-center gap-1.5 bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                <AlertTriangle className="h-4 w-4" /> {loginError}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground py-4 text-sm font-bold shadow-md transition cursor-pointer"
              >
                Entrar no Painel <ShieldCheck className="h-4 w-4" />
              </button>
            </div>
          </form>



          <div className="text-center mt-6">
            <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition flex items-center justify-center gap-1">
              <Globe className="h-3 w-3" /> Voltar para o Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN LAYOUT
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-6 duration-200">
          <div className={`rounded-2xl border px-5 py-4 shadow-xl flex items-center gap-3 ${toastType === 'success'
            ? 'bg-whatsapp/15 border-whatsapp text-primary'
            : toastType === 'error'
              ? 'bg-destructive/15 border-destructive text-destructive'
              : 'bg-primary/10 border-primary text-primary'
            }`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-whatsapp text-white' : toastType === 'error' ? 'bg-destructive text-white' : 'bg-primary text-white'
              }`}>
              {toastType === 'success' ? <Check className="h-4 w-4" /> : toastType === 'error' ? <X className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </div>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-primary block leading-none">
                Irene Comida Saudável
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Painel Administrativo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-border text-primary px-4 py-2 text-xs font-semibold transition"
            >
              <Globe className="h-3.5 w-3.5" /> Ir para o Site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 space-y-10">

        {/* Dashboard Stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total de Pratos</span>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="font-display text-3xl font-semibold text-primary">{stats.total}</span>
              <span className="text-xs text-muted-foreground">itens</span>
            </div>
          </div>

          {[
            { label: "Linha Fitness", count: stats.fitness, color: "bg-secondary text-primary border-primary/10" },
            { label: "Linha Gourmet", count: stats.gourmet, color: "bg-accent/20 text-accent-foreground border-accent/30" },
            { label: "Sopas & Caldos", count: stats.sopas, color: "bg-primary/10 text-primary border-primary/20" },
            { label: "Sobremesas Fit", count: stats.sobremesas, color: "bg-card border-border text-muted-foreground" }
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
              <div className="flex items-center justify-between mt-4">
                <span className="font-display text-3xl font-semibold text-primary">{stat.count}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${stat.color}`}>
                  Ativos
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Action Bar */}
        <section className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">Cadastro de Cardápio</h2>
            <p className="text-muted-foreground text-xs mt-1">
              Adicione novos pratos, configure ingredientes, macros de calorias e tags nutricionais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDatabase}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-border text-primary px-5 py-3 text-xs font-bold transition cursor-pointer"
              title="Voltar ao cardápio padrão com os 15 pratos"
            >
              <RotateCcw className="h-4 w-4" /> Restaurar Cardápio Inicial
            </button>

            <button
              onClick={handleOpenAddForm}
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground px-6 py-3 text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Cadastrar Novo Prato
            </button>
          </div>
        </section>

        {/* Product Table */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/40 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Prato</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Tags Nutricionais</th>
                  <th className="px-6 py-4 text-center">Calorias</th>
                  <th className="px-6 py-4 text-center">Macros (P / C / G)</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-secondary/15 transition">

                    {/* Item */}
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="h-10 w-10 rounded-xl object-cover bg-muted flex-shrink-0 border border-border"
                        />
                        <div className="min-w-0">
                          <span className="font-display text-sm font-semibold text-primary block truncate">
                            {dish.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1">
                            {dish.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase border ${dish.category === "fitness"
                        ? "bg-secondary text-primary border-primary/10"
                        : dish.category === "gourmet"
                          ? "bg-accent/20 text-accent-foreground border-accent/20"
                          : dish.category === "sopas"
                            ? "bg-primary/10 text-primary border-primary/10"
                            : "bg-background border-border text-muted-foreground"
                        }`}>
                        {dish.category === "fitness" ? "Fitness" : dish.category === "gourmet" ? "Gourmet" : dish.category === "sopas" ? "Sopa/Caldo" : "Sobremesa"}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {dish.tags.length > 0 ? dish.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-medium text-muted-foreground bg-secondary/60 rounded px-1.5 py-0.5">
                            {tag}
                          </span>
                        )) : (
                          <span className="text-muted-foreground/50 text-[10px] italic">Sem tags</span>
                        )}
                      </div>
                    </td>

                    {/* Kcal */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="font-semibold text-primary flex items-center justify-center gap-0.5">
                        <Flame className="h-3.5 w-3.5 text-accent-foreground" /> {dish.nutritionalInfo.calories} <span className="text-[9px] font-normal text-muted-foreground">kcal</span>
                      </span>
                    </td>

                    {/* Macros */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[10px]">
                        <span className="text-primary font-bold">{dish.nutritionalInfo.protein}g <span className="text-[8px] font-normal text-muted-foreground">Prot</span></span>
                        <span className="text-muted-foreground/30">/</span>
                        <span className="text-accent-foreground font-semibold">{dish.nutritionalInfo.carbs}g <span className="text-[8px] font-normal text-muted-foreground">Carb</span></span>
                        <span className="text-muted-foreground/30">/</span>
                        <span className="text-muted-foreground font-medium">{dish.nutritionalInfo.fat}g <span className="text-[8px] font-normal text-muted-foreground">Gord</span></span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditForm(dish)}
                          className="p-2 rounded-lg bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
                          title="Editar prato"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(dish.id, dish.name)}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition cursor-pointer"
                          title="Excluir prato"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* FOOTER CREDITS */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border mt-auto">
        <p>© {new Date().getFullYear()} Irene Comida Saudável &middot; Painel Administrativo do Sistema</p>
      </footer>

      {/* CREATE / EDIT DIALOG FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />

          <div className="relative bg-background border border-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="font-display text-lg font-bold text-primary">
                {editingDish ? "Editar Prato do Cardápio" : "Cadastrar Novo Prato"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-border transition text-muted-foreground hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* AI Generator Panel */}
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                {isAiPanelOpen ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        🪄 Chef IA Assistente
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAiPanelOpen(false)}
                        className="text-[9px] font-semibold text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        Fechar
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ex: Marmita low carb de salmão grelhado..."
                        disabled={isAiLoading}
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateWithAI}
                        disabled={isAiLoading}
                        className="rounded-xl px-4 py-2 bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isAiLoading ? "Criando..." : "Gerar"}
                      </button>
                    </div>
                    <p className="text-[9px] text-muted-foreground">
                      A IA preencherá automaticamente o nome, descrição deliciosa, macros e categoria ideais.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAiPanelOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-primary/30 hover:border-primary bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    🪄 Preencher formulário automaticamente com Inteligência Artificial
                  </button>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Nome do Prato *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Filé de Tilápia com Molho Cítrico"
                  className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Descrição / Ingredientes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalhe o preparo e os acompanhamentos (ex: Filé fresco grelhado servido com molho natural de maracujá e arroz de brócolis cozido no vapor)..."
                  className="w-full bg-background border border-border rounded-2xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none transition"
                />
              </div>

              {/* Category & Image Selector Panel */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition"
                    >
                      <option value="fitness">Linha Fitness</option>
                      <option value="gourmet">Linha Gourmet</option>
                      <option value="sopas">Sopas & Caldos</option>
                      <option value="sobremesas">Sobremesas Fit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Foto do Prato *
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Thumbnail Preview */}
                    <div className="h-10 w-10 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center flex-shrink-0">
                      {formImage ? (
                        <img src={formImage} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Upload Button */}
                    <label className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary hover:bg-border text-primary px-3 h-10 text-xs font-bold transition cursor-pointer flex-1 border border-border text-center whitespace-nowrap">
                      <Plus className="h-3.5 w-3.5" /> Escolher Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    {formImage && (
                      <button
                        type="button"
                        onClick={() => setFormImage("")}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition cursor-pointer flex-shrink-0"
                        title="Limpar imagem"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct text URL fallback optionally displayed under */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Ou cole o link da imagem (URL)
                  </label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg ou caminho relativo..."
                    className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-ring transition"
                  />
                </div>
              </div>

              {/* Macros Row */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                  Macros & Informação Nutricional
                </span>
                <div className="grid grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1 text-center">Kcal</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formCalories}
                      onChange={(e) => setFormCalories(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl p-2 text-center text-xs focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1 text-center">Proteínas (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formProtein}
                      onChange={(e) => setFormProtein(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl p-2 text-center text-xs focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1 text-center">Carboidratos (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formCarbs}
                      onChange={(e) => setFormCarbs(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl p-2 text-center text-xs focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1 text-center">Gorduras (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formFat}
                      onChange={(e) => setFormFat(Number(e.target.value))}
                      className="w-full bg-background border border-border rounded-xl p-2 text-center text-xs focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Checkbox Panel */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Tags Nutricionais
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Sem Glúten", "Sem Lactose", "Vegano", "Low Carb", "Proteico"].map((tag) => {
                    const isChecked = formTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleFormTag(tag)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer ${isChecked
                          ? "bg-primary border-primary text-primary-foreground shadow-sm"
                          : "bg-background border-border text-muted-foreground hover:bg-secondary"
                          }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl px-5 py-3 text-xs font-bold bg-secondary text-primary hover:bg-border transition cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-6 py-3 text-xs font-bold bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground shadow-md transition cursor-pointer text-center"
                >
                  {editingDish ? "Salvar Alterações" : "Salvar Prato"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

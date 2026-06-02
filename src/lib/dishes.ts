import meal1 from "@/assets/meal-1.jpg";
import meal2 from "@/assets/meal-2.jpg";
import meal3 from "@/assets/meal-3.jpg";
import customMeal1 from "@/assets/Marmitas/619585152_17977532441994213_7084860203398861969_n.webp";
import customMeal2 from "@/assets/Marmitas/624781009_18097587484899822_2612383851172836262_n.webp";
import { supabase } from "@/lib/supabase";

export interface NutritionalInfo {
  calories: number; // kcal
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: "fitness" | "gourmet" | "sopas" | "sobremesas";
  tags: string[]; // ["Sem Glúten", "Sem Lactose", "Vegano", "Low Carb", "Proteico"]
  nutritionalInfo: NutritionalInfo;
  image: string;
}

export interface Combo {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  description: string;
  highlight: boolean;
  cta: string;
}

export const COMBOS: Combo[] = [
  {
    id: "iniciante",
    title: "Iniciante",
    subtitle: "Unidade",
    quantity: 1,
    description: "Ideal para testar nosso tempero e se apaixonar pela qualidade.",
    highlight: false,
    cta: "Pedir agora",
  },
  {
    id: "semanal",
    title: "Semanal",
    subtitle: "7 marmitas",
    quantity: 7,
    description: "Uma semana de foco total e zero preocupação com o mercado.",
    highlight: false,
    cta: "Ativar plano",
  },
  {
    id: "quinzena",
    title: "Quinzena",
    subtitle: "15 marmitas",
    quantity: 15,
    description: "O equilíbrio perfeito entre variedade e economia para sua rotina.",
    highlight: true,
    cta: "Melhor Custo-Benefício",
  },
  {
    id: "mensal",
    title: "Mensal",
    subtitle: "30 marmitas",
    quantity: 30,
    description: "Transformação completa: 30 dias de alimentação de alta performance.",
    highlight: false,
    cta: "Mudar minha vida",
  },
];

const isClient = typeof window !== "undefined";

export const DEFAULT_DISHES: Dish[] = [
  // LINHA FITNESS
  {
    id: "fit-escondidinho",
    name: "Escondidinho de Batata Doce com Frango",
    description: "Frango desfiado temperado com ervas finas e coberto com purê cremoso de batata doce salpicado com gergelim.",
    category: "fitness",
    tags: ["Sem Glúten", "Sem Lactose", "Proteico"],
    nutritionalInfo: { calories: 380, protein: 32, carbs: 45, fat: 8 },
    image: customMeal1,
  },
  {
    id: "fit-patinho",
    name: "Patinho Moído com Arroz Integral e Brócolis",
    description: "Carne magra de patinho refogada com temperos naturais, acompanhada de arroz integral soltinho e brócolis cozido ao vapor.",
    category: "fitness",
    tags: ["Sem Glúten", "Sem Lactose", "Proteico", "Low Carb"],
    nutritionalInfo: { calories: 360, protein: 34, carbs: 32, fat: 9 },
    image: meal2,
  },
  {
    id: "fit-frango-cabotia",
    name: "Frango Grelhado com Purê de Abóbora Cabotiá e Vagem",
    description: "Filé de peito de frango grelhado bem suculento com purê rústico de abóbora e vagem salteada no azeite de oliva extra virgem.",
    category: "fitness",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb", "Proteico"],
    nutritionalInfo: { calories: 310, protein: 30, carbs: 22, fat: 7 },
    image: meal3,
  },
  {
    id: "fit-sobrecoxa-legumes",
    name: "Sobrecoxa Assada ao Alecrim com Legumes no Vapor",
    description: "Sobrecoxa de frango assada marinada no limão e alecrim, acompanhada de um mix de legumes frescos (cenoura, abobrinha e couve-flor).",
    category: "fitness",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb", "Proteico"],
    nutritionalInfo: { calories: 340, protein: 28, carbs: 12, fat: 18 },
    image: customMeal2,
  },
  {
    id: "fit-strogonoff",
    name: "Estrogonofe de Frango Fit com Arroz Integral",
    description: "Cubos de peito de frango com creme de ricota leve e cogumelos frescos, servido com arroz integral.",
    category: "fitness",
    tags: ["Sem Glúten", "Proteico"],
    nutritionalInfo: { calories: 395, protein: 31, carbs: 38, fat: 11 },
    image: meal1,
  },

  // LINHA GOURMET
  {
    id: "gourmet-salmao",
    name: "Salmão Grelhado com Risoto de Quinoa e Alcaparras",
    description: "Lombo de salmão grelhado ao ponto do chef, sobre risoto cremoso de quinoa branca e vermelha com molho suave de alcaparras.",
    category: "gourmet",
    tags: ["Sem Glúten", "Proteico", "Sem Lactose"],
    nutritionalInfo: { calories: 450, protein: 36, carbs: 24, fat: 22 },
    image: meal1,
  },
  {
    id: "gourmet-mignon",
    name: "Filé Mignon ao Molho Funghi e Purê de Mandioquinha",
    description: "Medalhão de filé mignon grelhado com molho funghi seco artesanal e purê aveludado de mandioquinha (batata baroa).",
    category: "gourmet",
    tags: ["Sem Glúten", "Proteico"],
    nutritionalInfo: { calories: 480, protein: 38, carbs: 28, fat: 16 },
    image: meal2,
  },
  {
    id: "gourmet-tilapia",
    name: "Tilápia com Molho de Maracujá e Arroz de Brócolis",
    description: "Filé de tilápia fresca grelhada com molho cítrico e aromático de maracujá, servido com arroz de brócolis super soltinho.",
    category: "gourmet",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb", "Proteico"],
    nutritionalInfo: { calories: 320, protein: 29, carbs: 14, fat: 12 },
    image: meal3,
  },
  {
    id: "gourmet-spaghetti-abobrinha",
    name: "Spaghetti de Abobrinha com Almôndegas ao Sugo",
    description: "Espaguete de abobrinha italiana fresca com molho pomodoro caseiro e almôndegas artesanais de patinho recheadas com ervas.",
    category: "gourmet",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb", "Vegano"],
    nutritionalInfo: { calories: 290, protein: 26, carbs: 16, fat: 10 },
    image: customMeal1,
  },
  {
    id: "gourmet-nhoque-batata-doce",
    name: "Nhoque de Batata Doce ao Molho Pesto com Tiras de Mignon",
    description: "Nhoque artesanal de batata doce ao molho pesto de manjericão e nozes, coroado com tiras grelhadas de filé mignon.",
    category: "gourmet",
    tags: ["Sem Glúten", "Proteico"],
    nutritionalInfo: { calories: 490, protein: 34, carbs: 42, fat: 18 },
    image: customMeal2,
  },

  // SOPAS & CALDOS
  {
    id: "sopa-caldo-verde",
    name: "Caldo Verde Fit com Paio de Lombo desfiado",
    description: "Cremoso caldo à base de couve-flor e batata, com couve manteiga fininha salpicado com paio de lombo suíno magro e desfiado.",
    category: "sopas",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb"],
    nutritionalInfo: { calories: 220, protein: 14, carbs: 18, fat: 8 },
    image: meal3,
  },
  {
    id: "sopa-abobora-gengibre",
    name: "Creme de Abóbora com Gengibre e Frango",
    description: "Creme aveludado de abóbora cabotiá com raspas de gengibre termogênico e bastante frango desfiado.",
    category: "sopas",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb", "Proteico"],
    nutritionalInfo: { calories: 240, protein: 22, carbs: 20, fat: 6 },
    image: customMeal1,
  },
  {
    id: "sopa-canja-integral",
    name: "Canja de Galinha Integral Aromática",
    description: "Clássica canja caseira com peito de frango em cubos, arroz integral, cenoura, aipo e cheiro-verde fresco colhido na hora.",
    category: "sopas",
    tags: ["Sem Glúten", "Sem Lactose", "Proteico"],
    nutritionalInfo: { calories: 260, protein: 24, carbs: 26, fat: 5 },
    image: customMeal2,
  },

  // SOBREMESAS FIT
  {
    id: "doce-brownie",
    name: "Brownie de Chocolate Belga Fit",
    description: "Brownie super úmido sem glúten e sem lactose, preparado com farinha de amêndoas, cacau belga 70% e adoçado com eritritol.",
    category: "sobremesas",
    tags: ["Sem Glúten", "Sem Lactose", "Low Carb"],
    nutritionalInfo: { calories: 180, protein: 5, carbs: 12, fat: 12 },
    image: meal2,
  },
  {
    id: "doce-mousse-maracuja",
    name: "Mousse de Maracujá Proteico",
    description: "Mousse aerado de maracujá elaborado com polpa de fruta natural e whey protein isolado de baunilha, sem adição de açúcar.",
    category: "sobremesas",
    tags: ["Sem Glúten", "Proteico"],
    nutritionalInfo: { calories: 140, protein: 16, carbs: 8, fat: 3 },
    image: meal1,
  },
];

const STORAGE_KEY = "irene_dishes";

export function getStoredDishes(): Dish[] {
  if (!isClient) return DEFAULT_DISHES;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DISHES));
    return DEFAULT_DISHES;
  }
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_DISHES;
  }
}

export function saveDish(dish: Dish): Dish[] {
  if (!isClient) return DEFAULT_DISHES;
  
  const current = getStoredDishes();
  const index = current.findIndex(d => d.id === dish.id);
  
  if (index >= 0) {
    current[index] = dish;
  } else {
    current.push(dish);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current;
}

export function deleteDish(id: string): Dish[] {
  if (!isClient) return DEFAULT_DISHES;
  
  const current = getStoredDishes();
  const filtered = current.filter(d => d.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function resetDishes(): Dish[] {
  if (!isClient) return DEFAULT_DISHES;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DISHES));
  return DEFAULT_DISHES;
}

export const DISHES = getStoredDishes();

// =========================================================================
// ASYNC CLOUD SYNCING FOR SUPABASE
// =========================================================================

export async function fetchDishesFromSupabase(): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from("dishes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      if (isClient) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return data as Dish[];
    }
    
    // If the database is connected but empty, upload the default 15 dishes to seed it!
    if (data && data.length === 0) {
      await resetDishesInSupabase();
      return DEFAULT_DISHES;
    }
  } catch (e) {
    console.warn("Supabase fetch failed, falling back to local storage cache:", e);
  }
  
  return getStoredDishes();
}

export async function saveDishToSupabase(dish: Dish): Promise<Dish[]> {
  // Update local cache immediately for zero-latency UI
  saveDish(dish);
  
  try {
    const { error } = await supabase
      .from("dishes")
      .upsert({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        category: dish.category,
        tags: dish.tags,
        nutritionalInfo: dish.nutritionalInfo,
        image: dish.image
      });

    if (error) throw error;
  } catch (e) {
    console.error("Supabase upsert failed:", e);
  }
  
  return getStoredDishes();
}

export async function deleteDishFromSupabase(id: string): Promise<Dish[]> {
  // Update local cache immediately
  deleteDish(id);
  
  try {
    const { error } = await supabase
      .from("dishes")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (e) {
    console.error("Supabase delete failed:", e);
  }
  
  return getStoredDishes();
}

export async function resetDishesInSupabase(): Promise<Dish[]> {
  resetDishes();
  
  try {
    // Delete all current records safely
    const { error: deleteError } = await supabase
      .from("dishes")
      .delete()
      .neq("id", "none_placeholder_id");

    if (deleteError) throw deleteError;

    // Upload defaults to seed
    const { error: insertError } = await supabase
      .from("dishes")
      .insert(DEFAULT_DISHES);

    if (insertError) throw insertError;
  } catch (e) {
    console.error("Supabase reset failed:", e);
  }
  
  return getStoredDishes();
}


import { prisma, Roles } from "../src/configs";
import { hashPassword } from "../src/utils/crypto";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@pizza.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";

const ingredientsByType: Record<string, { name: string; description: string }[]> = {
  Base: [
    { name: "Thin Crust", description: "Crispy, light and thin" },
    { name: "Hand Tossed", description: "Classic soft and airy dough" },
    { name: "Cheese Burst", description: "Molten cheese inside the crust" },
    { name: "Whole Wheat", description: "Wholesome whole wheat dough" },
    { name: "Gluten Free", description: "Rice and tapioca flour base" },
  ],
  Sauce: [
    { name: "Classic Marinara", description: "Slow-cooked tomato and herbs" },
    { name: "Pesto", description: "Basil, pine nuts and parmesan" },
    { name: "BBQ", description: "Smoky and sweet" },
    { name: "Garlic Cream", description: "Creamy roasted garlic" },
    { name: "Spicy Arrabbiata", description: "Tomato with red chilli" },
  ],
  Cheese: [
    { name: "Mozzarella", description: "Stretchy and mild" },
    { name: "Cheddar", description: "Sharp and tangy" },
    { name: "Parmesan", description: "Aged and nutty" },
    { name: "Vegan Cheese", description: "Plant-based melt" },
  ],
  Vegetable: [
    { name: "Bell Pepper", description: "Crunchy capsicum" },
    { name: "Onion", description: "Sliced red onion" },
    { name: "Mushroom", description: "Fresh button mushrooms" },
    { name: "Black Olive", description: "Pitted black olives" },
    { name: "Sweet Corn", description: "Golden sweet corn" },
    { name: "Jalapeño", description: "Pickled jalapeño slices" },
    { name: "Tomato", description: "Fresh diced tomato" },
    { name: "Spinach", description: "Baby spinach leaves" },
  ],
};

const pizzas = [
  {
    name: "Margherita",
    description: "Marinara, mozzarella and fresh basil on a hand-tossed base",
    price: 299,
    ingredients: ["Hand Tossed", "Classic Marinara", "Mozzarella", "Tomato"],
  },
  {
    name: "Veggie Supreme",
    description: "Loaded with peppers, onion, mushroom, olives and corn",
    price: 399,
    ingredients: [
      "Hand Tossed",
      "Classic Marinara",
      "Mozzarella",
      "Bell Pepper",
      "Onion",
      "Mushroom",
      "Black Olive",
      "Sweet Corn",
    ],
  },
  {
    name: "Pesto Garden",
    description: "Basil pesto, parmesan, spinach and tomato on thin crust",
    price: 349,
    ingredients: ["Thin Crust", "Pesto", "Parmesan", "Spinach", "Tomato"],
  },
  {
    name: "Smoky BBQ Fiesta",
    description: "BBQ sauce, cheddar, onion, corn and jalapeño",
    price: 379,
    ingredients: ["Cheese Burst", "BBQ", "Cheddar", "Onion", "Sweet Corn", "Jalapeño"],
  },
];

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: "Admin",
        password: await hashPassword(ADMIN_PASSWORD),
        role: Roles.ADMIN,
        isEmailVerified: true,
      },
    });
    console.log(`Created admin ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log(`Admin ${ADMIN_EMAIL} already exists`);
  }

  const ingredientIdByName = new Map<string, string>();
  for (const [typeName, items] of Object.entries(ingredientsByType)) {
    const type = await prisma.ingredientType.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });

    for (const item of items) {
      const existing = await prisma.ingredient.findFirst({
        where: { name: item.name, typeId: type.id },
      });
      const ingredient =
        existing ??
        (await prisma.ingredient.create({
          data: { ...item, typeId: type.id, stock: 100 },
        }));
      ingredientIdByName.set(item.name, ingredient.id);
    }
  }
  console.log(`Ingredients ready: ${ingredientIdByName.size}`);

  for (const pizza of pizzas) {
    const existing = await prisma.pizza.findFirst({ where: { name: pizza.name } });
    if (existing) continue;
    await prisma.pizza.create({
      data: {
        name: pizza.name,
        description: pizza.description,
        price: pizza.price,
        ingredients: {
          connect: pizza.ingredients.map((name) => ({ id: ingredientIdByName.get(name)! })),
        },
      },
    });
  }
  console.log(`Menu pizzas ready: ${pizzas.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

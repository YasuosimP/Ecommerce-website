import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "gaming-gadgets", nameEn: "Gaming Gadgets", nameFr: "Gadgets Gaming" },
  { slug: "car-accessories", nameEn: "Car Accessories", nameFr: "Accessoires Auto" },
  { slug: "home-accessories", nameEn: "Home Accessories", nameFr: "Accessoires Maison" },
  { slug: "mobile-tech", nameEn: "Mobile Tech", nameFr: "Tech Mobile" }
];

async function main() {
  await prisma.featuredSection.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliveryFee.deleteMany();

  const created = await Promise.all(categories.map((c) => prisma.category.create({ data: { ...c, description: c.nameEn } })));

  for (let i = 1; i <= 20; i++) {
    const category = created[i % created.length];
    const product = await prisma.product.create({
      data: {
        nameEn: `Product ${i}`,
        nameFr: `Produit ${i}`,
        slug: `product-${i}`,
        descriptionEn: `High quality product ${i} for Tunisia market`,
        descriptionFr: `Produit de qualité ${i} pour le marché tunisien`,
        price: (20 + i).toFixed(3),
        categoryId: category.id,
        images: {
          create: [{
            url: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80`,
            alt: `Product ${i}`
          }]
        },
        variants: {
          create: ["Standard", "Premium"].map((name, idx) => ({
            sku: `SKU-${i}-${idx}`,
            labelEn: name,
            labelFr: idx ? "Premium" : "Standard",
            price: (20 + i + idx * 5).toFixed(3),
            inventory: { create: { quantity: 20 - idx } }
          }))
        }
      }
    });
    await prisma.featuredSection.create({
      data: { kind: i % 2 ? "BEST_SELLER" : "NEW_ARRIVAL", itemId: product.id, rank: i }
    });
  }

  await prisma.deliveryFee.create({ data: { amount: "7.000", isDefault: true } });
  await prisma.deliveryFee.create({ data: { governorate: "Tunis", city: "Tunis", amount: "5.000" } });

  console.log("Seed completed");
}

main().finally(() => prisma.$disconnect());

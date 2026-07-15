import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Clear existing data
  await prisma.coupon.deleteMany();
  await prisma.adminActivityLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing database tables.");

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Uncle Emeka",
      email: "admin@yankeegadgets.ng",
      passwordHash: "$2b$12$K1dJv2g0H9U8p6wB2rR.OevnZf2gYV9K3w/Z7LwFqYmK8T1f3h2.y", // placeholder hash for password
      role: "ADMIN",
      phone: "+2348030000000",
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Kamsy",
      email: "kamsy@yankeegadgets.ng",
      passwordHash: "$2b$12$K1dJv2g0H9U8p6wB2rR.OevnZf2gYV9K3w/Z7LwFqYmK8T1f3h2.y",
      role: "STAFF",
      phone: "+2348030000001",
    },
  });

  console.log("Created Admin & Staff users.");

  // Create Categories
  const categoriesData = [
    { name: "Phones", slug: "phones" },
    { name: "Earbuds", slug: "earbuds" },
    { name: "Accessories", slug: "accessories" },
    { name: "Gaming", slug: "gaming" },
    { name: "Consoles", slug: "consoles" },
  ];

  const categoriesMap: Record<string, any> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoriesMap[cat.slug] = created;
  }

  console.log("Created product categories.");

  // Helper for generating local asset placeholder SVG URLs or standard mock URLs
  // Since we don't have Cloudinary uploaded yet, we can use SVG data URLs or high quality mock image links (e.g. Unsplash placeholders)
  const products = [
    {
      name: "iPhone 15 Pro Max 256GB",
      slug: "iphone-15-pro-max-256gb",
      brand: "Apple",
      description: "Experience the ultimate iPhone with a titanium design, revolutionary new 48MP main camera, and the industry-leading A17 Pro chip. The lightweight aerospace-grade titanium build makes it incredibly strong yet comfortable to hold.",
      shortDescription: "Titanium design, A17 Pro chip, Action button, and 5x Telephoto camera.",
      price: 185000000, // ₦1,850,000 in kobo
      compareAtPrice: 195000000, // ₦1,950,000 in kobo
      stock: 12,
      sku: "AP-IP15PM-256",
      categoryId: categoriesMap["phones"].id,
      specs: {
        "Screen Size": "6.7 inches",
        "Processor": "A17 Pro",
        "Storage": "256GB",
        "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
        "Weight": "221g"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1695048132924-a78a63bf66b3?q=80&w=600&auto=format&fit=crop"
      ],
      variants: [
        { name: "Color", value: "Natural Titanium", priceDiff: 0, stock: 5 },
        { name: "Color", value: "Blue Titanium", priceDiff: 0, stock: 4 },
        { name: "Color", value: "Black Titanium", priceDiff: 0, stock: 3 }
      ]
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      brand: "Samsung",
      description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility starting with the most important device in your life. Your smartphone.",
      shortDescription: "Galaxy AI, 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3.",
      price: 175000000, // ₦1,750,000 in kobo
      compareAtPrice: 185000000,
      stock: 8,
      sku: "SS-S24U-512",
      categoryId: categoriesMap["phones"].id,
      specs: {
        "Screen Size": "6.8 inches Dynamic AMOLED 2X",
        "Processor": "Snapdragon 8 Gen 3 for Galaxy",
        "Storage": "512GB",
        "RAM": "12GB",
        "Camera": "200MP Main + 50MP + 12MP + 10MP",
        "Battery": "5000 mAh"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
      ],
      variants: [
        { name: "Color", value: "Titanium Gray", priceDiff: 0, stock: 4 },
        { name: "Color", value: "Titanium Black", priceDiff: 0, stock: 4 }
      ]
    },
    {
      name: "Sony WF-1000XM5 Wireless Earbuds",
      slug: "sony-wf-1000xm5-earbuds",
      brand: "Sony",
      description: "The WF-1000XM5 features cutting-edge technology to deliver premium sound quality and the best truly wireless noise-canceling performance on the market. With a specially designed driver unit, for wide frequency reproduction, deep bass and clear vocals.",
      shortDescription: "The best noise-canceling earbuds with high-res audio and crystal-clear calls.",
      price: 25000000, // ₦250,000 in kobo
      compareAtPrice: 28000000,
      stock: 15,
      sku: "SN-WF1000XM5",
      categoryId: categoriesMap["earbuds"].id,
      specs: {
        "Battery Life": "Up to 8 hours (24 hours with case)",
        "Bluetooth Version": "5.3",
        "Water Resistance": "IPX4",
        "Noise Cancelling": "Yes, dual processors"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop"
      ],
      variants: [
        { name: "Color", value: "Black", priceDiff: 0, stock: 10 },
        { name: "Color", value: "Silver", priceDiff: 0, stock: 5 }
      ]
    },
    {
      name: "Apple AirPods Pro 2",
      slug: "apple-airpods-pro-2",
      brand: "Apple",
      description: "AirPods Pro have been re-engineered for up to 2x more Active Noise Cancellation. Adaptive Audio dynamically tailors noise control to your environment. Spatial Audio takes immersion to a remarkably personal level.",
      shortDescription: "Active Noise Cancellation, Adaptive Audio, and MagSafe Charging Case (USB-C).",
      price: 32000000, // ₦320,000 in kobo
      stock: 20,
      sku: "AP-APP2-USBC",
      categoryId: categoriesMap["earbuds"].id,
      specs: {
        "Chip": "H2 Headphone chip",
        "Connectivity": "Bluetooth 5.3",
        "Battery": "Up to 6 hours listening time on a single charge",
        "Charging Case": "MagSafe (USB-C) with speaker and lanyard loop"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop"
      ],
      variants: []
    },
    {
      name: "PlayStation 5 Slim Digital Edition",
      slug: "playstation-5-slim-digital",
      brand: "Sony",
      description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio, and an all-new generation of incredible PlayStation games.",
      shortDescription: "Slim design, 1TB SSD storage, haptic feedback, 4K gaming, and digital-only play.",
      price: 64000000, // ₦640,000 in kobo
      compareAtPrice: 68000000,
      stock: 6,
      sku: "SN-PS5S-DIG",
      categoryId: categoriesMap["consoles"].id,
      specs: {
        "Storage Capacity": "1TB custom SSD",
        "Graphics": "Ray Tracing Acceleration, up to 120fps with 120Hz output",
        "Audio": "Tempest 3D AudioTech",
        "Included": "DualSense Wireless Controller, HDMI, Power Cord"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop"
      ],
      variants: []
    },
    {
      name: "PlayStation 5 Disc Edition",
      slug: "playstation-5-disc-edition",
      brand: "Sony",
      description: "Play your favorite PS5 and PS4 games on Blu-ray Discs. You can also download digital PS5 and PS4 games from the PlayStation Store. Enjoy stunning visuals, near-instant load times, and tactile controller responses.",
      shortDescription: "Play physical game discs and 4K Blu-ray movies with the integrated disc drive.",
      price: 72000000, // ₦720,000 in kobo
      stock: 4,
      sku: "SN-PS5-DISC",
      categoryId: categoriesMap["consoles"].id,
      specs: {
        "Storage Capacity": "825GB SSD",
        "Drive": "Ultra HD Blu-ray Optical Drive",
        "Resolution Support": "4K 120Hz, 8K TVs",
        "Controller": "DualSense Controller included"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop"
      ],
      variants: []
    },
    {
      name: "DualSense Edge Wireless Controller",
      slug: "dualsense-edge-wireless-controller",
      brand: "Sony",
      description: "Get an edge in gameplay by creating your own custom controls to fit your playstyle. Built with high performance and personalization in mind, the DualSense Edge wireless controller invites you to craft your own unique gaming experience.",
      shortDescription: "Ultra-customizable controls, swappable stick caps, and mappable back buttons.",
      price: 24000000, // ₦240,000 in kobo
      stock: 10,
      sku: "SN-DSE-CTRL",
      categoryId: categoriesMap["accessories"].id,
      specs: {
        "Battery Life": "Varies by profile",
        "Customization": "Changeable stick caps, trigger stops, custom button profiles",
        "Connector": "USB-C with braided cable lock"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=600&auto=format&fit=crop"
      ],
      variants: []
    },
    {
      name: "Apple 20W USB-C Power Adapter",
      slug: "apple-20w-usbc-power-adapter",
      brand: "Apple",
      description: "The Apple 20W USB-C Power Adapter offers fast, efficient charging at home, in the office, or on the go. While the power adapter is compatible with any USB-C-enabled device, Apple recommends pairing it with iPad Pro and iPad Air.",
      shortDescription: "Genuine Apple fast charger for iPhone and iPad.",
      price: 2500000, // ₦25,000 in kobo
      compareAtPrice: 3000000,
      stock: 50,
      sku: "AP-20W-PWR",
      categoryId: categoriesMap["accessories"].id,
      specs: {
        "Wattage": "20W",
        "Output Port": "USB-C",
        "Compatibility": "iPhone 8 or later, iPad models"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1619137839356-9e8a946cf61c?q=80&w=600&auto=format&fit=crop"
      ],
      variants: []
    },
    {
      name: "Elden Ring: Shadow of the Erdtree Edition (PS5)",
      slug: "elden-ring-shadow-of-the-erdtree-ps5",
      brand: "Bandai Namco",
      description: "Winner of hundreds of accolades including Game of the Year, ELDEN RING returns with a massive new expansion. Shadow of the Erdtree takes players to the Land of Shadow to explore a new adventure full of mysteries and danger.",
      shortDescription: "The acclaimed RPG + the massive Shadow of the Erdtree expansion on PS5 disc.",
      price: 6500000, // ₦65,000 in kobo
      stock: 15,
      sku: "GM-ER-SOTE-PS5",
      categoryId: categoriesMap["gaming"].id,
      specs: {
        "Platform": "PlayStation 5",
        "Genre": "Action RPG",
        "Publisher": "Bandai Namco Entertainment",
        "Rating": "M (Mature 17+)"
      },
      isPublished: true,
      images: [
        "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop"
      ],
      variants: []
    }
  ];

  for (const prod of products) {
    const { images, variants, ...prodFields } = prod;

    // Create the Product
    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
        specs: prodFields.specs || {},
      },
    });

    // Create its images
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({
          productId: createdProduct.id,
          url,
          altText: `${createdProduct.name} Image ${index + 1}`,
          position: index,
        })),
      });
    }

    // Create its variants
    if (variants && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((v) => ({
          productId: createdProduct.id,
          name: v.name,
          value: v.value,
          priceDiff: v.priceDiff,
          stock: v.stock,
        })),
      });
    }
  }

  // Create standard discount coupons
  await prisma.coupon.createMany({
    data: [
      { code: "YANKEE5", type: "percent", value: 5 },
      { code: "WELCOME10K", type: "fixed", value: 1000000 }, // ₦10,000 off
    ],
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

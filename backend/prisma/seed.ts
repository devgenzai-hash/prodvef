import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Super Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@trustverify.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@trustverify.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create Demo Company
  const companyPassword = await bcrypt.hash("company123", 12);
  const company = await prisma.company.upsert({
    where: { email: "demo@acmecorp.com" },
    update: {},
    create: {
      name: "Acme Corporation",
      email: "demo@acmecorp.com",
      password: companyPassword,
      phone: "+1-555-0100",
      taxId: "TAX-ACME-001",
      description: "Leading manufacturer of quality consumer products",
      status: "APPROVED",
      address: "123 Innovation Drive",
      city: "San Francisco",
      country: "United States",
    },
  });
  console.log("✅ Demo company created:", company.email);

  // Create Demo Products
  const product1 = await prisma.product.upsert({
    where: {
      companyId_sku_batchNumber: {
        companyId: company.id,
        sku: "ACME-WIDGET-001",
        batchNumber: "BATCH-2026-001",
      },
    },
    update: {},
    create: {
      companyId: company.id,
      name: "Premium Widget Pro",
      sku: "ACME-WIDGET-001",
      category: "Electronics",
      batchNumber: "BATCH-2026-001",
      manufacturingDate: new Date("2026-01-15"),
      expiryDate: new Date("2028-01-15"),
      description: "High-quality premium widget with advanced features",
      status: "VERIFIED",
      verifiedAt: new Date(),
    },
  });

  const product2 = await prisma.product.upsert({
    where: {
      companyId_sku_batchNumber: {
        companyId: company.id,
        sku: "ACME-GADGET-002",
        batchNumber: "BATCH-2026-002",
      },
    },
    update: {},
    create: {
      companyId: company.id,
      name: "Smart Gadget X",
      sku: "ACME-GADGET-002",
      category: "Electronics",
      batchNumber: "BATCH-2026-002",
      manufacturingDate: new Date("2026-02-01"),
      description: "Next-generation smart gadget with IoT connectivity",
      status: "PENDING",
    },
  });

  // Create Verification Codes
  await prisma.verificationCode.upsert({
    where: { uniqueCode: "TV-ACME-PRO-2026-XK9M7" },
    update: {},
    create: {
      productId: product1.id,
      uniqueCode: "TV-ACME-PRO-2026-XK9M7",
      status: "ACTIVE",
      scanCount: 3,
    },
  });

  await prisma.verificationCode.upsert({
    where: { uniqueCode: "TV-ACME-GAD-2026-LP4N2" },
    update: {},
    create: {
      productId: product2.id,
      uniqueCode: "TV-ACME-GAD-2026-LP4N2",
      status: "ACTIVE",
      scanCount: 0,
    },
  });

  console.log("✅ Demo products & verification codes created");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin: admin@trustverify.com / admin123");
  console.log("   Company: demo@acmecorp.com / company123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

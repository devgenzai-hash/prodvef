import { CompanySidebar } from "@/components/layout/CompanySidebar";

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <CompanySidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { companyApi } from "@/lib/api";
import { toast } from "sonner";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await companyApi.getProfile();
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyApi.updateProfile(profile);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information</p>
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Status Banner */}
        <Card className="mb-6">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Account Status</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            <StatusBadge status={profile?.status || "PENDING"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Company Name"
                value={profile?.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Phone"
                value={profile?.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Input
                label="Website"
                value={profile?.website || ""}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://your-company.com"
              />
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={profile?.description || ""}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                />
              </div>
              <Input
                label="Address"
                value={profile?.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  value={profile?.city || ""}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
                <Input
                  label="Country"
                  value={profile?.country || ""}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

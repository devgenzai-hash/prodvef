import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Platform configuration and settings</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Suspicious Scan Threshold</p>
                  <p className="text-sm text-muted-foreground">
                    Number of scans before flagging as suspicious
                  </p>
                </div>
                <input
                  type="number"
                  defaultValue={5}
                  className="h-10 w-20 rounded-lg border px-3 text-center text-sm"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Auto-approve Companies</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new company registrations
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

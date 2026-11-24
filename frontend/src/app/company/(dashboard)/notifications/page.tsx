"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/Loading";
import { companyApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Bell, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await companyApi.getNotifications();
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      await companyApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on your products and account</p>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <Bell className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No notifications</h3>
            <p className="text-muted-foreground">You&apos;re all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "opacity-60" : "border-l-4 border-l-blue-500"}
            >
              <CardContent className="flex items-start justify-between p-4">
                <div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markRead(notification.id)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark read
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

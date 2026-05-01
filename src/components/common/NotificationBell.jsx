import { Bell } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../../store/AppStateContext.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../Button.jsx";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { state, actions } = useAppState();
  const unreadCount = state.notifications.filter((notification) => !notification.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        aria-label="Notifications"
      >
        <Bell aria-hidden="true" className="h-5 w-5" />
        {unreadCount ? (
          <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="surface absolute end-0 top-13 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
            <h2 className="font-bold text-slate-950">Notifications</h2>
            <Button type="button" variant="ghost" className="min-h-9 px-3 py-1 text-xs" onClick={actions.markAllNotificationsRead}>
              Mark read
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {state.notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => actions.markNotificationRead(notification.id)}
                className="w-full border-b border-slate-100 p-4 text-start transition hover:bg-slate-50"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge tone={notification.type === "cancelled" ? "cancelled" : notification.type === "confirmed" ? "confirmed" : "neutral"}>
                    {notification.type}
                  </Badge>
                  {!notification.read ? <span className="h-2 w-2 rounded-full bg-brand-600" /> : null}
                </div>
                <p className="font-bold text-slate-950">{notification.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">{notification.timestamp}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

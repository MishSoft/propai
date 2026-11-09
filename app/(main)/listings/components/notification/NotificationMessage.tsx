"use client"

import { useTranslations } from "next-intl";
import type { AppNotification } from "@/store/useNotificationStore";

type NotificationMessageData = Pick<AppNotification, "message" | "type" | "presentation">;

export default function NotificationMessage({ notification }: { notification: NotificationMessageData }) {
  const t = useTranslations("Notifications");
  const presentation = notification.presentation;

  if (
    notification.type !== "NEW_BUYER" ||
    presentation?.type !== "NEW_BUYER" ||
    !presentation.buyerName.trim()
  ) {
    return <>{notification.message}</>;
  }

  if (presentation.category === "Buy") {
    return <>{t("new_buyer_buy", { name: presentation.buyerName })}</>;
  }

  if (presentation.category === "Rent") {
    return <>{t("new_buyer_rent", { name: presentation.buyerName })}</>;
  }

  return <>{notification.message}</>;
}

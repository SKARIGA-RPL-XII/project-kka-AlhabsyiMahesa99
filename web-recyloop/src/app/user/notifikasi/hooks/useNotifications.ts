"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  USER_NOTIFICATION_ITEMS_PER_PAGE,
  fetchUserNotifications,
  userNotificationKeys,
} from "./notificationQueries";

export function useNotifications() {
  const [currentPage, setCurrentPage] = useState(1);

  const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: userNotificationKeys.list("me"),
    queryFn: fetchUserNotifications,
    staleTime: 30 * 1000,
  });

  const items = useMemo(() => data || [], [data]);
  const errorMessage = error instanceof Error ? error.message : null;
  const totalPages = Math.max(1, Math.ceil(items.length / USER_NOTIFICATION_ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const from = (safeCurrentPage - 1) * USER_NOTIFICATION_ITEMS_PER_PAGE;
    const to = from + USER_NOTIFICATION_ITEMS_PER_PAGE;
    return items.slice(from, to);
  }, [items, safeCurrentPage]);

  return {
    loading: isLoading,
    errorMessage,
    items,
    paginatedItems,
    currentPage: safeCurrentPage,
    totalPages,
    pickFirst,
    formatDateTime,
    setCurrentPage,
  };
}

"use client";

import React from "react";
import { UsersHeader, UsersTabsAndSearch } from "./components/UsersHeader";
import { UsersTable } from "./components/UsersTable";
import { SuspendUserModal } from "./components/SuspendUserModal";
import { AddCourierModal } from "./components/AddCourierModal";
import { useUsers } from "./hooks/useUsers";

export default function UserManagementPage() {
  const {
    users,
    loading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    suspendTarget,
    setSuspendTarget,
    suspendReason,
    setSuspendReason,
    submittingSuspend,
    showAddCourierModal,
    setShowAddCourierModal,
    courierForm,
    setCourierForm,
    creatingCourier,
    suspensionReasons,
    handleActivateUser,
    handleOpenSuspendModal,
    handleSuspendUser,
    handleCreateCourier,
  } = useUsers();

  return (
    <div className="space-y-8 pb-10 font-poppins text-[#222D33]">
      {/* Header */}
      <UsersHeader onAddCourier={() => setShowAddCourierModal(true)} />

      {/* Tabs + Search */}
      <UsersTabsAndSearch
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Table */}
      <UsersTable
        users={users}
        loading={loading}
        suspensionReasons={suspensionReasons}
        onOpenSuspend={handleOpenSuspendModal}
        onActivate={handleActivateUser}
      />

      {/* Suspend Modal */}
      <SuspendUserModal
        open={Boolean(suspendTarget)}
        target={suspendTarget}
        reason={suspendReason}
        setReason={setSuspendReason}
        submitting={submittingSuspend}
        onClose={() => setSuspendTarget(null)}
        onSubmit={handleSuspendUser}
      />

      {/* Add Courier Modal */}
      <AddCourierModal
        open={showAddCourierModal}
        form={courierForm}
        onChange={(field, value) => setCourierForm((prev) => ({ ...prev, [field]: value }))}
        onClose={() => setShowAddCourierModal(false)}
        onSubmit={handleCreateCourier}
        creating={creatingCourier}
      />
    </div>
  );
}

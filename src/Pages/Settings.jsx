import AppLayout from "@/components/Layouts/appLayout"
import DashboardSettings from "@/components/fragments/settings"

const Settings = () => {
    return (
      <AppLayout>
      <div className="flex flex-col gap-6 py-6 relative">
        <DashboardSettings />
      </div>
      </AppLayout>
    )
}
export default Settings
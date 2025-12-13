import AppLayout from "@/components/Layouts/appLayout"
import PredictPage from "@/components/fragments/predict/PredictItem"

const Predict = () => {
    return (
      <AppLayout>
      <div className="flex flex-col gap-6 py-6 relative">
        <PredictPage />
      </div>
      </AppLayout>
    )
}

export default Predict
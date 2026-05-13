import { Link } from "react-router-dom";
import QRScanner from "../../qr/QRScanner";
import Button from "../../../shared/component/Button";
import InputWithLabel from "../../../shared/component/InputWithLabel";
import { type CreateQuantityReportRequest } from "../../quanity_report/quantityReport.type";
import { useEnterQuantityReport } from "../hooks/useEnterQuantityReport";

const EnterQuantityReportSection = () => {
  const { scannedUser, isProcessing, isSubmitting, handleScan, handleSubmit, cancel, register, handleSmartSubmit, reset } = useEnterQuantityReport();


  const onSubmit = async (data: CreateQuantityReportRequest) => {
      await handleSubmit(data.quantity);
      reset();
  };

  return (
    <div className="grid grid-cols-12 gap-4 bg-gray-100 min-h-screen">

        {!scannedUser ? (
          <div className="col-span-9 col-start-3 flex justify-center">
            <QRScanner onScanSuccess={handleScan} className="w-3/4 h-2/3" />
            {isProcessing && (
              <p className="text-blue-500 text-sm animate-pulse">Authenticating...</p>
            )}
          </div>
        ) : (
          <div className="col-span-9 col-start-3 flex flex-col items-center gap-4">
            <p className="text-green-600 font-medium text-sm self-center">
              Authenticated. Enter quantity below.
            </p>
  
            <form onSubmit={handleSmartSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm">
              <InputWithLabel
                label="Quantity"
                type="number"
                min={1}
                placeholder="Enter quantity"
                {...register("quantity", { valueAsNumber: true })}
              />
              <div className="flex gap-3 items-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  content={isSubmitting ? "Submitting..." : "Submit"}
                />
                <button
                  type="button"
                  onClick={cancel}
                  className="text-gray-500 underline text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      
       <div className="col-span-9 col-start-3 flex flex-col items-center gap-4">
        <Link to="/" className="text-blue-500 bg-blue-100 hover:bg-green-100">Go back</Link>
      </div>
      
    </div>
  );
};

export default EnterQuantityReportSection;

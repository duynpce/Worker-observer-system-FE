import { Link } from "react-router-dom";
import QRScanner from "../../qr/QRScanner";
import Button from "../../../shared/component/Button";
import SelectWithLabel from "../../../shared/component/SelectWithLabel";
import { useUpdateItemStationScanner } from "../hooks/useUpdateItemStationScanner";

const UpdateItemStationSection = () => {
    const {
        scannedItemId,
        isProcessing,
        isSubmitting,
        selectedStation,
        setSelectedStation,
        handleScan,
        handleSubmit,
        cancel,
        stationOptions,
    } = useUpdateItemStationScanner();

    return (
        <div className="grid grid-cols-12 gap-4 bg-gray-100 min-h-screen">

            {!scannedItemId  ? (
                <div className="col-span-9 col-start-3 flex justify-center">
                    <QRScanner onScanSuccess={handleScan} className="w-3/4 h-2/3" />
                    {isProcessing && (
                        <p className="text-blue-500 text-sm animate-pulse">Processing...</p>
                    )}
                </div>
            ) : (
                <div className="col-span-9 col-start-3 flex flex-col items-center gap-4">
                    <p className="text-green-600 font-medium text-sm self-center">
                        Item scanned. Choose a station below.
                    </p>

                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <SelectWithLabel
                            label="Station"
                            data={stationOptions}
                            value={selectedStation}
                            onChange={(e) => setSelectedStation(e.target.value as typeof selectedStation)}
                        />
                        <div className="flex gap-3 items-center">
                            <Button
                                type="button"
                                disabled={isSubmitting}
                                content={isSubmitting ? "Submitting..." : "Submit"}
                                onClick={handleSubmit}
                            />
                            <button
                                type="button"
                                onClick={cancel}
                                className="text-gray-500 underline text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-span-9 col-start-3 flex flex-col items-center gap-4">
                <Link to="/" className="text-blue-500 bg-blue-100 hover:bg-green-100">Go back</Link>
            </div>

        </div>
    );
};

export default UpdateItemStationSection;
import { useRef, useState } from "react";
import { useUpdateItemStation } from "../../item/useItem";
import { Station } from "../../account/account.type";
import type { Station as StationType } from "../../account/account.type";
import { toast } from "react-toastify";

const STATION_OPTIONS = Object.values(Station) as StationType[];


export const useUpdateItemStationScanner = () => {
    const [scannedItemId, setScannedItemId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedStation, setSelectedStation] = useState<StationType>(STATION_OPTIONS[0]);
    const lastScannedRef = useRef<{ text: string | null; timestamp: number } | null>(null);
    const isLockedRef = useRef(false);
    const DEBOUNCE_MS = 5000;

    const updateItemStationMutation = useUpdateItemStation();

    const resetScannerState = (blockedItemId: string | null = null) => {
        isLockedRef.current = false;
        lastScannedRef.current = blockedItemId
            ? { text: blockedItemId, timestamp: Date.now() }
            : null;
        setScannedItemId(null);
        setSelectedStation(STATION_OPTIONS[0]);
        setIsProcessing(false);
    };

    const handleScan = (decodedText: string) => {
        if (isLockedRef.current) return;

      
        const trimmed = decodedText.trim();

        if (!trimmed) {
            toast.error("Invalid QR code.");
            return;
        }
        
        const now = Date.now();
        if (
            lastScannedRef.current &&
            lastScannedRef.current.text === trimmed &&
            now - lastScannedRef.current.timestamp < DEBOUNCE_MS
        ) return;
        lastScannedRef.current = { text: trimmed, timestamp: now };

        isLockedRef.current = true;
        setIsProcessing(true);
        setScannedItemId(trimmed);
    };

    const handleSubmit = async () => {
        if (!scannedItemId) return;

        const submittedItemId = scannedItemId;

        try {
            await updateItemStationMutation.mutateAsync({ id: submittedItemId, station: selectedStation });
        } finally {
            resetScannerState(submittedItemId);
            toast.info("Item station updated. You can scan the next item.");
        }
    };

    const cancel = () => {
        toast.info("Cancelling current operation...");
        resetScannerState(scannedItemId);
    };

    const restart = () => {
        toast.info("Restarting scanner...");
        resetScannerState();
    };

    return {
        scannedItemId,
        isProcessing,
        isSubmitting: updateItemStationMutation.isPending,
        selectedStation,
        setSelectedStation,
        handleScan,
        handleSubmit,
        cancel,
        restart,
        stationOptions: STATION_OPTIONS,
    };
};

import { useEffect, useLayoutEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface UseQRScannerOptions {
    elementId: string;
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (error: string) => void;
}

export const useQRScanner = ({ elementId, onScanSuccess, onScanError }: UseQRScannerOptions) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const onScanSuccessRef = useRef(onScanSuccess);
    const onScanErrorRef = useRef(onScanError);

    // Keep refs pointing to the latest callbacks on every render
    useLayoutEffect(() => {
        onScanSuccessRef.current = onScanSuccess;
        onScanErrorRef.current = onScanError;
    });

    useEffect(() => {
        if (scannerRef.current !== null) {
            return;
        }

        const scanner = new Html5QrcodeScanner(
            elementId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scannerRef.current = scanner;

        // Use refs so the callback always calls the latest handler,
        // even after React re-renders update loginMutation / checkAttendanceMutation.
        scanner.render(
            (decodedText) => {
                onScanSuccessRef.current(decodedText);
            },
            (error) => {
                onScanErrorRef.current?.(error);
            }
        );

    }, [elementId]);

    return scannerRef;
};

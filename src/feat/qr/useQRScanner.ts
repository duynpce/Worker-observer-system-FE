import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface UseQRScannerOptions {
    elementId: string;
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (error: string) => void;
}

export const useQRScanner = ({ elementId, onScanSuccess, onScanError }: UseQRScannerOptions) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {

      if(scannerRef.current !== null) {
        return;
      }

        const scanner = new Html5QrcodeScanner(
            elementId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                onScanSuccess(decodedText);
            },
            (error) => {
                onScanError?.(error);
            }
        );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementId]);

    return scannerRef;
};

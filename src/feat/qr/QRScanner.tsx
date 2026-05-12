import { useQRScanner } from "./useQRScanner";

const QR_ELEMENT_ID = "qr-scanner-region";

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (error: string) => void;
    className?: string;
}

const QRScanner = ({ onScanSuccess, onScanError, className }: QRScannerProps) => {
    useQRScanner({ elementId: QR_ELEMENT_ID, onScanSuccess, onScanError });
    return <div id={QR_ELEMENT_ID} className={className} />;
};

export default QRScanner;

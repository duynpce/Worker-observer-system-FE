import { useRef, useState } from "react";
import { useLogin } from "../../auth/useAuth";
import { useCreateQuantityReport } from "../../quanity_report/useQuantityReport";
import { toast } from "react-toastify";
import { CreateQuantityReportSchema, type CreateQuantityReportRequest } from "../../quanity_report/quantityReport.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormCustom } from "../../../shared/hook/useFormCustom";

export const useEnterQuantityReport = () => {
    const [scannedUser, setScannedUser] = useState<{ username: string; password: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const lastScannedRef = useRef<{ text: string; timestamp: number } | null>(null);
    const DEBOUNCE_MS = 5000;

    const loginMutation = useLogin();
    const createReportMutation = useCreateQuantityReport();
    const { register, handleSmartSubmit, reset } = useFormCustom<CreateQuantityReportRequest>({
      resolver: zodResolver(CreateQuantityReportSchema),
  });

    const handleScan = async (decodedText: string) => {
        if (isProcessing || scannedUser) return;

        const now = Date.now();
        if (
            lastScannedRef.current &&
            lastScannedRef.current.text === decodedText &&
            now - lastScannedRef.current.timestamp < DEBOUNCE_MS
        ) return;
        lastScannedRef.current = { text: decodedText, timestamp: now };

        const parts = decodedText.trim().split(" ");
        if (parts.length < 2) {
            toast.error("Invalid QR code.");
            return;
        }

        const [username, password] = parts;
        setIsProcessing(true);
        try {
            await loginMutation.mutateAsync({ username, password });
            setScannedUser({ username, password });
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(message ?? "Authentication failed. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (quantity: number) => {
        try{
            await createReportMutation.mutateAsync({ quantity });
        }
        finally {
        // Clear scanned user → QRScanner remounts fresh for the next worker
        setScannedUser(null);
        setIsProcessing(false);
        }
    };

    const cancel = () => {
        setIsProcessing(false);
        setScannedUser(null);
    };

    return {
        scannedUser,
        isProcessing,
        isSubmitting: createReportMutation.isPending,
        handleScan,
        handleSubmit,
        cancel,
        register,
        handleSmartSubmit,
        reset,
    };
};

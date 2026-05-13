import { useRef, useState } from "react";
import { useLogin } from "../../auth/useAuth";
import { useCheckAttendance } from "../../attendance/useDailyAttendance";
import type { AttendanceTypeValue } from "../../attendance/dailyAttendance.type";
import { toast } from "react-toastify";

export const useAttendanceScanner = (attendanceType: AttendanceTypeValue) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const restartRef = useRef<(() => Promise<void>) | null>(null);
    const lastScannedRef = useRef<{ text: string; timestamp: number } | null>(null);

    const DEBOUNCE_MS = 5000;

    const loginMutation = useLogin();
    const checkAttendanceMutation = useCheckAttendance();

    const handleScan = async (decodedText: string) => {
        if (isProcessing) {
            return;
        }

        const now = Date.now();
        if (
            lastScannedRef.current &&
            lastScannedRef.current.text === decodedText &&
            now - lastScannedRef.current.timestamp < DEBOUNCE_MS
        ) {
            return;
        }
        lastScannedRef.current = { text: decodedText, timestamp: now };

        setIsProcessing(true);
        const parts = decodedText.trim().split(" ");
        if (parts.length < 2) {
            toast.error("Invalid QR code.");
            setIsProcessing(false);
            return;
        }

        const [username, password] = parts;

        try {
            await loginMutation.mutateAsync({ username, password });
            await checkAttendanceMutation.mutateAsync(attendanceType);
        } finally {
            //delay restart to prevent immediate re-scan of the same QR code
            setIsProcessing(false);
            await restartRef.current?.();
        }
    };

    const restart = async () => {
        await restartRef.current?.();
    };

    return { isProcessing, handleScan, restart };
};

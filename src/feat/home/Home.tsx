import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Worker Observer System</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Use the QR scanner to record worker attendance and quantity reports. Select an action below to begin.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <Link
                        to="/check-attendance"
                        className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        Check Attendance
                    </Link>
                    <Link
                        to="/check-out"
                        className="w-full text-center bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 rounded-xl border border-blue-600 transition-colors"
                    >
                        Check Out
                    </Link>
                    <Link
                        to="/enter-quantity-report"
                        className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        Enter Quantity Report
                    </Link>

                    <Link
                        to="/update-item-station"
                        className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        Update Item Station
                    </Link>
                </div>

                <p className="text-xs text-gray-400">Scan a worker's QR code to log their entry, exit time, or quantity report.</p>
            </div>
        </div>
    );
};

export default Home;

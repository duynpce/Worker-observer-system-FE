import QRScanner from '../../qr/QRScanner';
import { useAttendanceScanner } from '../hooks/useAttendanceScanner';
import { AttendanceType } from '../../attendance/dailyAttendance.type';
import Button from '../../../shared/component/Button';
import { Link } from 'react-router-dom';
const CheckOutScanner = () => {
  const { handleScan, isProcessing, restart } = useAttendanceScanner(AttendanceType.END_TIME);
    return( 
    <div className="grid grid-cols-12 gap-4 bg-gray-100 min-h-screen">
      <div className="col-span-9 col-start-3 flex justify-center">
        <QRScanner onScanSuccess={handleScan} className="w-3/4 h-2/3" />
        {isProcessing && (
          <p className="text-blue-500 text-sm animate-pulse">Processing...</p>
        )}
      </div>

      <div className="col-span-9 col-start-3 flex flex-col items-center gap-4">
        <Button onClick={restart} disabled={isProcessing} content="reset scanner" />
        <Link to="/" className="text-blue-500 bg-blue-100 hover:bg-green-100">Go back</Link>
      </div>
    </div>
    )
}

export default CheckOutScanner;
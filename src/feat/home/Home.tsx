import { toast } from 'react-toastify';
import QRScanner from '../qr/QRScanner';
const Home = () => {
    return (
        <div className="home">
           default home 
           <QRScanner onScanSuccess={(decodedText) => toast(decodedText)} />
        </div>
    );
}

export default Home;
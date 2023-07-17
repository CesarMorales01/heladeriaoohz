import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import fondo from '../../../public/Images/Config/fondo1.jpg'

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <div className=" sm:max-w-md mt-6 px-6 py-4 shadow-md overflow-hidden sm:rounded-lg" >
                <Link href="/">
                <img style={{ width: '10em', height: '10em', marginTop: '1em' }} src={fondo} className="img-fluid rounded" alt="" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-gray-100 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}

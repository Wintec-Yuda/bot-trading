import Link from "next/link"

const Navbar = () => {
    return (
        <header className="bg-gray-800 shadow p-4">
            <nav className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-gray-100">Bot Trading</Link>
            </nav>
        </header>
    )
}

export default Navbar
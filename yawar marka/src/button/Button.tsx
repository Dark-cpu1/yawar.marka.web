import '../App'
import '../style/style.css'
const apiUrl = import.meta.env.VITE_API_URL
console.log(apiUrl)
function Button() {
    return(
        <>
        <div className="relative min-h-screen bg-[#36393f]">
            <button
                className="
                absolute top-10 right-6
                px-6 py-2
                bg-indigo-600
                hover:bg-indigo-500
                text-white
                font-semibold
                rounded-xl
                shadow-lg
                transition-all duration-300
                hover:scale-105
                active:scale-95
                ">
            Registro
            </button>
        </div>
        </>
    )
}

export default Button

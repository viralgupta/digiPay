import { useRouter } from "next/router"
import { useEffect } from "react"

const Book = () => {
    const router = useRouter()
    useEffect(() => {
        localStorage.clear()
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        window.localStorage.clear()
        setTimeout(() => {
            router.push('/login')
        }, 500);
        //eslint-disable-next-line
    }, [])

    return (
        <></>
    )
}

export default Book
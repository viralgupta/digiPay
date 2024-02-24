import { useRouter } from "next/router"
import { useEffect } from "react"

const Verify = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/')
    //eslint-disable-next-line
  }, [])

  return (
    <></>
  )
}

export default Verify
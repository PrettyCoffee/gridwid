import { useHashRouter } from "components/utility/hash-router"

const NotesIdRoute = () => {
  const { params } = useHashRouter()
  return <div className="">Notes id: {params["id"]}</div>
}
export default NotesIdRoute

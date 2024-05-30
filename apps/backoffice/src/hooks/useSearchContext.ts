import { SearchContext } from "@/context/search-provider";
import { useContext } from "react"

export const useSearchContex = () => {
    const { text, setText, filterList } = useContext(SearchContext);
    return {
        text, setText, filterList
    }
}
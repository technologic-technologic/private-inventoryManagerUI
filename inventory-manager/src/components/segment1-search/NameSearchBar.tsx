import { Input } from 'antd';
import {useSearchContext} from "../../context/SearchContext";

const NameSearchBar: React.FC = () => {
    const {searchName, setSearchName} = useSearchContext();

    return (
            <Input placeholder="Watermelon"
                   style={{ width: 200 }}
                   value={searchName}
                   onChange={(e) => {
                       setSearchName(e.target.value)
                   }}/>


    );
}

export default NameSearchBar;
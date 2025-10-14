import React from 'react';
import {Pagination, type PaginationProps} from 'antd';
import {useSearchContext} from "../../../context/SearchContext";
import {useDataContext} from "../../../context/DataContext";

const InventoryTablePageSelector: React.FC = () => {
    const {page, setParams} = useSearchContext();
    const {total} = useDataContext()

    const handlePageChange: PaginationProps['onChange'] = (pagination) => {
        setParams({page: ((pagination as number) - 1)});
    }
    return (
        <Pagination defaultCurrent={1}
                    total={total ? total * 10 : 1}
                    onChange={handlePageChange}
                    current={(page as unknown as number) + 1}
                    showSizeChanger={false}
        />
    )
}

export default InventoryTablePageSelector;
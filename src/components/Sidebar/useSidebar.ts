import { useState } from "react";

const useSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    console.log(collapsed, 2222);
    return { collapsed, setCollapsed };
};

export default useSidebar;

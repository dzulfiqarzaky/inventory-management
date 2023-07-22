import { useState } from "react";

const useSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    return { collapsed, setCollapsed };
};

export default useSidebar;

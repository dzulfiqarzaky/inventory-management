import { useState, useEffect } from "react";

function useLocalTime(isoDateString: string) {
    const [localizedDate, setLocalizedDate] = useState<string | null>(null);

    useEffect(() => {
        const date = new Date(isoDateString);
        const options = { timeZone: "Asia/Jakarta" };
        const formattedDate = date.toLocaleDateString("id-ID", options);
        setLocalizedDate(formattedDate);
    }, [isoDateString]);

    if (localizedDate == null) return "";
    return localizedDate;
}

export default useLocalTime;

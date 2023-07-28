/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState, useEffect } from "react";

export function convertToISODate(dateString: string) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function useDateSorter(dateStrings: string[]) {
    const [sortedDates, setSortedDates] = useState<string[]>([]);

    useEffect(() => {
        const sortedDates: string[] = dateStrings
            .map(convertToISODate)
            .sort((a: string, b: string): number => a.localeCompare(b));
        if (typeof sortedDates[0] === "string") {
            setSortedDates(sortedDates);
        }
    }, [dateStrings]);

    return sortedDates;
}

export default useDateSorter;

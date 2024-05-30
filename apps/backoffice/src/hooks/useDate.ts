export const useGetDate = (date: string | number | Date) => {
    const creation = new Date(date);
    const actual = new Date();
    const timeElapsedInYears = actual.getFullYear() - creation.getFullYear();
    const timeElapsedInMonths = (actual.getMonth() - creation.getMonth()) + (12 * timeElapsedInYears);
    const timeElapsedInDays = Math.floor((actual.getTime() - creation.getTime()) / (1000 * 60 * 60 * 24));

    if (timeElapsedInYears > 0) {
        return `${timeElapsedInYears} ${timeElapsedInYears === 1 ? 'year' : 'years'} ago`;
    } else if (timeElapsedInMonths > 0) {
        return `${timeElapsedInMonths} ${timeElapsedInMonths === 1 ? 'month' : 'months'} ago`;
    } else {
        if (timeElapsedInDays === 0) return 'Today'
        return `${timeElapsedInDays} ${timeElapsedInDays === 1 ? 'day' : 'days'} ago`;
    }
}
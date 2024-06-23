
function calculateHours(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMilliseconds = Math.abs(end.getTime() - start.getTime());
    return diffMilliseconds / (1000 * 60 * 60);
}
export default calculateHours
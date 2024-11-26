export function getDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }
    return currentDate.toLocaleDateString('uk', options);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(date))
}

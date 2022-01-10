import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const now = new Date().getTime()
    const pubDate = new Date(value).getTime()
    // console.log(pubDate)
    const dateAgo = now - pubDate
    const yearDiff = Math.floor(dateAgo / 3.154e10)
    const monthDiff = Math.floor(dateAgo / 2628336213.69853735)
    const weekDiff = Math.floor(dateAgo / 604876712.32874584198)
    const dayDiff = Math.floor(dateAgo / 86410958.904106542468)
    const hourDiff = Math.floor(dateAgo / 3600456.6210044394247)
    const minDiff = Math.floor(dateAgo / 60000)
    if (yearDiff > 0) return `${yearDiff} years ago`
    if (monthDiff > 0) return `${monthDiff} months ago`
    if (weekDiff > 0) return `${weekDiff} weeks ago`
    if (dayDiff > 0) return `${dayDiff} days ago`
    if (hourDiff > 0) return `${hourDiff} hours ago`
    if (minDiff > 0) return `${minDiff} minutes ago`
    else return 'now'
  }
}

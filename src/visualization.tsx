import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chart, { Point, LevelLine } from './chart'

const gramsPerOzEtOH = 23.36
const bloodWaterPercentage = 0.806

interface VisualizationProps {
    bodyWeightKg: number
    precentWater: number
    ouncesEtOH: number
    metabolicRate: number

    wordPerMinute: number
    totalWordCount: number
    barleycornIndicies: number[]
}

const legalLimitBac = 0.08
const deathBac = 0.6


export default class Visualization extends React.Component<VisualizationProps, {}> {
    private levelLines: LevelLine[] = [
        {
            class: 'legal-line',
            title: '🍻',
            value: legalLimitBac
        }, {
            class: 'dead-line',
            title: '☠',
            value: deathBac
        }
    ]

    /**
     * Compute blood alcohol content for a single intake of alchol
     * 
     * Based on https://web.archive.org/web/20040202204141/www.nhtsa.dot.gov/people/injury/alcohol/bacreport.html
     * 
     * @param timeInHours Time since drink was taken
     */
    private computeBac(timeInHours: number): number {
        const bodyWaterML = this.props.bodyWeightKg * this.props.precentWater * 1000
        const concEtOHinWater = gramsPerOzEtOH * this.props.ouncesEtOH / bodyWaterML
        const concEtOHinBlood = concEtOHinWater * bloodWaterPercentage
        const gramPercentEtOHinBlood = concEtOHinBlood * 100
        const bac = gramPercentEtOHinBlood - (this.props.metabolicRate * timeInHours)
        return Math.max(0, bac)
    }

    /**
     * Compute total blood alchol content
     * 
     * @param timeInMinutes Time since drinking began
     */
    private compute(timeInMinutes: number): number {
        let total = 0
        const offset = timeInMinutes * this.props.wordPerMinute
        for (const i of this.props.barleycornIndicies) {
            if (i > offset)
                break
            const start = i * (1.0 / this.props.wordPerMinute)
            total += this.computeBac((timeInMinutes - start) / 60.0)
        }
        return Math.min(100, total)
    }

    private get line(): Point[] {
        const end = Math.ceil(this.props.totalWordCount / this.props.wordPerMinute)

        const out: Point[] = []
        out.push({ time: 0, value: 0 })

        for (let i = 0; i < this.props.barleycornIndicies.length; ++i) {
            const index = this.props.barleycornIndicies[i]
            const start = index * (1.0 / this.props.wordPerMinute)
            out.push({ time: start, value: this.compute(start) })

            const next = this.props.barleycornIndicies[i + 1]
            if (!next)
                break;

            // Get additional samples at one minute intervals between points
            const nextStart = next * (1.0 / this.props.wordPerMinute)
            for (let forwardStart = start + 1; forwardStart < nextStart - 1; ++forwardStart) {
                out.push({ time: forwardStart, value: this.compute(forwardStart) })
            }
        }
        out.push({ time: end, value: this.compute(end) })

        return out
    }

    private get points(): Point[] {
        const out: Point[] = []
        out.push({ time: 0, value: 0 })

        for (let i = 0; i < this.props.barleycornIndicies.length; ++i) {
            const index = this.props.barleycornIndicies[i]
            const start = index * (1.0 / this.props.wordPerMinute)
            out.push({ time: start, value: this.compute(start) })
        }

        const end = Math.ceil(this.props.totalWordCount / this.props.wordPerMinute)
        out.push({ time: end, value: this.compute(end) })

        return out
    }

    private get timeToIntoxication(): number | null {
        for (const p of this.points) {
            if (p.value > legalLimitBac) {
                return p.time
            }
        }
        return null
    }

    private get timeToDeath(): number | null {
        for (const p of this.points) {
            if (p.value > deathBac) {
                return p.time
            }
        }
        return null
    }

    render() {
        return (
            <div className='chart'>
                <Chart line={this.line} points={this.points} levelLines={this.levelLines} />
                <div className='stats'>
                    {this.timeToIntoxication ? <span title='Intoxication'>🍻 after {Math.round(this.timeToIntoxication)} minutes</span> : ''}
                    {this.timeToDeath ? <span title='Death'>☠ after {Math.round(this.timeToDeath)}  minutes</span> : ''}
                </div>
            </div>
        )
    }
}

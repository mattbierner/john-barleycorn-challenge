import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chart, { Point } from './chart'

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

export default class Visualization extends React.Component<VisualizationProps, {}> {

    private computeBac(timeInHours: number): number {
        const bodyWaterML = this.props.bodyWeightKg * this.props.precentWater * 1000
        const concEtOHinWater = gramsPerOzEtOH * this.props.ouncesEtOH / bodyWaterML
        const concEtOHinBlood = concEtOHinWater * bloodWaterPercentage
        const gramPercentEtOHinBlood = concEtOHinBlood * 100
        const bac = gramPercentEtOHinBlood - (this.props.metabolicRate * timeInHours)
        return Math.max(0, bac)
    }

    private compute(timeInMinutes: number): number {
        let total = 0
        const offset = timeInMinutes * this.props.wordPerMinute
        for (const i of this.props.barleycornIndicies) {
            if (i > offset)
                break
            const start = i * (1.0 / this.props.wordPerMinute)
            total += this.computeBac((timeInMinutes - start) / 60.0)
        }
        return total
    }

    private get data(): Point[] {
        const out: Point[] = []
        for (let i = 0, len = Math.ceil(this.props.totalWordCount / this.props.wordPerMinute); i < len; ++i) {
            out.push({
                time: i,
                value: this.compute(i)
            })
        }
        return out
    }

    render() {
        return (
            <Chart data={this.data} />
        )
    }
}

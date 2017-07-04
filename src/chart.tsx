import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as d3 from 'd3'

export interface LevelLine {
    title: string
    class: string
    value: number
}

export interface Point {
    time: number
    value: number
}

const bisectDate = d3.bisector<Point, {}>((point: Point) => point.time).left

const hoverLabel = (point: Point) =>
    [`${point.value.toPrecision(3)} BAC`, `${point.time.toFixed(2)} min`]

interface CharProps {
    line: Point[]
    points: Point[]
    levelLines: LevelLine[]
}

export default class Chart extends React.Component<CharProps, {}> {
    private node: SVGSVGElement | null
    private margin = { left: 40, top: 20, right: 20, bottom: 40 }

    componentDidMount() {
        this.createBarChart()
        d3.select(window).on('resize', () => this.createBarChart())
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    private createBarChart(): void {
        if (!this.node)
            return

        const svgwidth = this.node.clientWidth
        const svgheight = this.node.clientHeight

        const width = +svgwidth - this.margin.left - this.margin.right
        const height = +svgheight - this.margin.top - this.margin.bottom

        const svg = d3.select(this.node)
        svg.selectAll('*').remove()
        svg.attr('viewBox', `0 0 ${svgwidth} ${svgheight}`)

        const g = svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

        const x = d3.scaleLinear()
            .rangeRound([0, width])

        const y = d3.scaleLinear()
            .rangeRound([height, 0])

        const line = d3.line<Point>()
            .x((d: Point) => x(d.time))
            .y((d: Point) => y(d.value))

        x.domain(d3.extent(this.props.line, (d: Point) => d.time) as number[])
        y.domain(d3.extent(this.props.line, (d: Point) => d.value) as number[])

        // x axis
        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .append('text')
            .attr('fill', '#000')
            .attr('y', 6)
            .attr('dy', '2.4em')
            .attr('dx', (width / 2) + 'px')
            .attr('text-anchor', 'middle')
            .text('Time elapsed (min)')

        // y axis
        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.70em')
            .attr('text-anchor', 'end')
            .text('Blood Alcohol Content')

        // limit lines
        for (const levelLine of this.props.levelLines) {
            const lineG = g.append('g').attr('class', levelLine.class)

            lineG.append('path')
                .datum([{ time: 0, value: levelLine.value }, { time: 50000, value: levelLine.value }])
                .attr('fill', 'none')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-width', 1.5)
                .attr('d', line);

            lineG.append('text')
                .attr('fill', '#000')
                .attr('x', width)
                .attr('y', y(levelLine.value))
                .attr('dy', '-0.4em')
                .text(levelLine.title)
        }

        // Line
        g.append('path')
            .datum(this.props.line)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line)

        // Points
        g.selectAll('scatter-dots')
            .data(this.props.points)
            .enter().append('svg:circle')
            .attr('class', 'dot')
            .attr('cy', (d) => y(d.value))
            .attr('cx', (d, i) => x(this.props.points[i].time))
            .attr('r', 2)

        // hover
        const focus = g.append('g')
            .attr('class', 'focus')
            .style('display', 'none')

        focus.append('circle')
            .attr('r', 4.5)

        focus.append('text')

        svg.append('rect')
            .attr('class', 'overlay')
            .attr('fill', 'none')
            .attr('width', width)
            .attr('height', height)
            .attr('x', this.margin.left)
            .attr('y', this.margin.top)
            .on('mouseover', () => { focus.style('display', null); })
            .on('mouseout', () => { focus.style('display', 'none'); })
            .on('mousemove', mousemove);

        const margin = this.margin
        const data = this.props.line
        function mousemove(this: any) {
            const x0 = x.invert(d3.mouse(this)[0] - margin.left)
            const i = bisectDate(data, x0, 1)
            const d0 = data[i - 1]
            const d1 = data[i]
            const d = x0 - d0.time > d1.time - x0 ? d1 : d0
            focus.attr('transform', 'translate(' + x(d.time) + ',' + y(d.value) + ')')
            focus.select('text').selectAll('*').remove()
            let g = 0
            for (const t of hoverLabel(d)) {
                focus.select('text')
                    .append('tspan')
                    .attr('x', d.time > x.domain()[1] / 2 ? -10 : 10)
                    .attr('y', (g++ * 1.4) + 'em')
                    .text(t)
            }
            focus.attr('text-anchor', d.time > x.domain()[1] / 2 ? 'end' : 'start')

        }
    }

    render() {
        return (
            <svg
                preserveAspectRatio='xMinYMin meet'
                ref={node => this.node = node} />
        )
    }
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as d3 from 'd3'

export interface Point {
    time: number
    value: number
}

const bisectDate = d3.bisector<Point, {}>((point: Point) => point.time).left

const hoverLabel = (point: Point) =>
    `${point.value.toPrecision(3)} BAC\nafter ${Math.round(point.time)} minutes`

interface CharProps {
    line: Point[]
    points: Point[]
}

export default class Chart extends React.Component<CharProps, {}> {
    private node: SVGSVGElement | null
    private margin = { left: 40, top: 20, right: 20, bottom: 20 }

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
        
        // y axis
        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Blood Alcohol Content')

        // legal limit line
        g.append('path')
            .datum([{ time: 0, value: 0.08}, {time: 9999, value: 0.08}])
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line)

        // Dead line
        g.append('path')
            .datum([{ time: 0, value: 0.6}, {time: 9999, value: 0.6}])
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line)

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
            .style('display', 'none');

        focus.append('circle')
            .attr('r', 4.5);

        focus.append('text')
            .attr('x', 9)
            .attr('dy', '.35em');

        svg.append('rect')
            .attr('class', 'overlay')
            .attr('fill', 'none')
            .attr('width', width)
            .attr('height', height)
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
            focus.attr('transform', 'translate(' + x(d.time) + ',' + y(d.value)  + ')')
            focus.select('text').text(hoverLabel(d))
        }
    }

    render() {
        return (
            <div className='chart'>
                <svg
                    preserveAspectRatio='xMinYMin meet'
                    ref={node => this.node = node} />
            </div>
        )
    }
}

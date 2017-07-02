import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as d3 from 'd3'

export interface Point {
    time: number
    value: number
}

        const bisectDate = d3.bisector<Point, {}>((point: Point) => point.time).left


interface CharProps {
    data: Point[]
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


        x.domain(d3.extent(this.props.data, (d: Point) => d.time) as number[])
        y.domain(d3.extent(this.props.data, (d: Point) => d.value) as number[])

        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .select('.domain')
            .remove()

        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Blood Alcohol Content')

        g.append('path')
            .datum(this.props.data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line)


        var focus = svg.append('g')
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

        const margin = this.margin;
        const data = this.props.data
        function mousemove(this: any) {
            const x0 = x.invert(d3.mouse(this)[0])
            const i = bisectDate(data, x0, 1)
            const d0 = data[i - 1]
            const d1 = data[i]
            const d = x0 - d0.time > d1.time - x0 ? d1 : d0
            focus.attr('transform', 'translate(' + (x(d.time) + margin.left) + ',' + (y(d.value) + margin.top) + ')')
            focus.select('text').text(d.value)
        }

    }

    render() {
        return (
            <svg className='chart'
                preserveAspectRatio='xMinYMin meet'
                ref={node => this.node = node} />
        )
    }
}

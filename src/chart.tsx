import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as d3 from 'd3'

export interface Point {
    time: number
    value: number
}

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

        // Extract the width and height that was computed by CSS.
        var svgwidth = this.node.clientWidth;
        var svgheight = this.node.clientHeight;

        // Use the extracted size to set the size of an SVG element.


        const svg = d3.select(this.node)
        svg.selectAll("*").remove();
        svg
            .attr("viewBox", `0 0 ${svgwidth} ${svgheight}`)

        const width = +svgwidth - this.margin.left - this.margin.right;
        const height = +svgheight - this.margin.top - this.margin.bottom;
        const g = svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        var x = d3.scaleLinear()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var line = d3.line<Point>()
            .x((d: Point) => x(d.time))
            .y((d: Point) => y(d.value));


        x.domain(d3.extent(this.props.data, (d: Point) => d.time) as number[]);
        y.domain(d3.extent(this.props.data, (d: Point) => d.value)as number[]);

        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .select('.domain')
            .remove();

        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('Blood Alcohol Content');

        g.append('path')
            .datum(this.props.data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line);

    }

    render() {
        return (
            <svg className='chart'
                preserveAspectRatio='xMinYMin meet'
                ref={node => this.node = node} />
        )
    }
}

import React, { Component } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';

export default class ChordDiagram extends Component {

    componentDidMount() {

        let { names, data } = this.props,
            colors = d3.schemeTableau10;

        let height = 1000, width = 1000,
            outerRadius = Math.min(width, height) * 0.5 - 125,
            innerRadius = outerRadius - 10;

        let formatValue = d3.format(".2");

        let chord = d3.chordDirected()
            .padAngle(10 / innerRadius)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        let arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        let ribbon = d3.ribbonArrow()
            .radius(innerRadius - 1)
            .padAngle(1 / innerRadius);

        let color = d3.scaleOrdinal(names, colors);

        const svg = d3.select('#' + this.props.id);

        svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

        const chords = chord(data);

        const group = svg.append("g")
            .attr("font-size", 12)
            .attr("font-family", "sans-serif")
            .selectAll("g")
            .data(chords.groups)
            .join("g");

        group.append("path")
            .attr("fill", d => color(names[d.index]))
            .attr("d", arc);

        group.append("title")
            .text(d => `${names[d.index]} ${formatValue(d.value)}`);

        const groupLabel = group.append("g")
            .attr("transform", d => {
                return `rotate(${(((d.endAngle - d.startAngle) / 2) + d.startAngle) * 180 / Math.PI - 90}) translate(${outerRadius},0)`;
            });

        groupLabel.append("line")
            .attr("stroke", "black")
            .attr("x2", 6);

        groupLabel.append("text")
            .attr("x", 8)
            .attr("dy", "0.35em")
            .style("font", "bold 20px sans-serif")
            .attr("transform", d => (((d.endAngle - d.startAngle) / 2) + d.startAngle) > Math.PI ? "rotate(180) translate(-16)" : null)
            .attr("text-anchor", d => (((d.endAngle - d.startAngle) / 2) + d.startAngle) > Math.PI ? "end" : null)
            .text(d => names[d.index])
            .style("cursor", "pointer")
            .attr('class','label-text-chord');

        svg.append("g")
            .attr("fill-opacity", 0.8)
            .selectAll("path")
            .data(chords)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("fill", d => color(names[d.source.index]))
            .attr("d", ribbon)
            .append("title")
            .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

            svg.selectAll('.label-text-chord')
            .call(wrap, 100);

    }

    render() {
        // set the dimensions of the graph
        return (
            <svg className='chord-diagram' id={this.props.id}></svg>
        );
    }
}



function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split("-").reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.95, // ems
            y = text.attr("y"),
            x = text.attr('x'),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan.attr('y', +y - 5);
                tspan = text.append("tspan").attr("x", x).attr("y", +y - 5).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}
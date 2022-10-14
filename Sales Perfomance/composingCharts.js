const lineBarPlot = (dataIn, svgIn, xRef, yRef, yTgt, refColor, tgtColor) => {
    // console.log(dataIn)
    //get the values to placed on the charts
    const cleanDataIn = dataIn;
    console.log(cleanDataIn)
    const xData = cleanDataIn.map(d => d[xRef]);
    const yData = cleanDataIn.map(d => d[yRef]);
    const yTarget = cleanDataIn.map(d => d[yTgt]);
    // console.log(xData, d3.max(yData), yTarget);

    const numberFormat = d3.format(".2s");

    const svg = d3.select(`#${svgIn}`);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { left: 50, right: 25, top: 25, bottom: 40 };

    const visHeight = height - margin.top - margin.bottom;
    const visWidth = width - margin.right - margin.left;

    const chart = svg.append('g')
        .attr('transform', `translate(${0}, ${margin.top})`);

    const xScale = d3.scalePoint()
        .domain(xData)
        .range([margin.left, visWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yData)])
        .range([visHeight, margin.top])
        .clamp(true);

    // const tgtScale = d3.scaleLinear()
    //     .domain([0, d3.max(yTarget)])
    //     .range([visHeight,margin.top])
    const yAxis = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale)
            .ticks(7, "$.2s"));

    // const yTgtAxis = svg.append('g')
    //     .attr('transform',`translate(${visWidth + margin.right},${margin.top})`)
    //     .call(d3.axisRight(tgtScale)
    //             .ticks(6, "$.2s"))
    const xAxis = svg.append('g')
        .attr('transform', `translate(${0},${visHeight + margin.top})`)
        .call(d3.axisBottom(xScale));

    axesDomain('x', xAxis, xRef, visWidth, visHeight);
    axesDomain('y', yAxis, yRef, visWidth, visHeight);
    // axesDomain('y',yTgtAxis,'Target',visWidth,visHeight)
    const bubbles = chart.selectAll('g')
        .data(cleanDataIn)
        .join('g');

    const bars = bubbles
        .append('rect')
        .attr('x', d => xScale(d[xRef]))
        .attr('y', d => yScale(d[yRef]))
        .attr('width', 30)
        .attr('height', d => visHeight - yScale(d[yRef]))
        .attr('class', 'ref')
        .attr('fill', refColor)
        .attr('opacity', 0.7);

    const linePath =  d3.line()
            .x(d => xScale(d[xRef]))
            .y(d => yScale(d[yTgt]))

    const linesGroup = chart.append('g');
    
    linesGroup.append('path')
        .attr('d', linePath(cleanDataIn))
        .attr('fill','none')
        .attr('stroke-width',2)
        .attr('stroke', tgtColor)


    const valuesRef = bubbles
        .append('text')
        .attr('x', d => xScale(d[xRef]))
        .attr('y', d => yScale(d[yRef]))
        .text(d => `${numberFormat(d[yRef])}`)
        .attr('fill', refColor)
        .attr('font-size', '15');

    const valuesTgt = bubbles
        .append('text')
        .attr('x', d => xScale(d[xRef]))
        .attr('y', d => yScale(d[yTgt]))
        .text(d => `${numberFormat(d[yTgt])}`)
        .attr('fill', tgtColor)
        .attr('font-size', '15')
        .attr('dy', -10);

}

function axesDomain(axis, axisObject, label, visWidth, visHeight){
    if (axis == 'x' || axis == 'X'){
    axisObject
    .call(g => g.select('.domain').remove())
    .append('text')
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'hanging')
    .attr('font-weight', 'bold')
    .attr('y', 20)
    .attr('x', visWidth /2)
    .text(label);
    } else if (axis == 'y' || axis == 'Y'){
        axisObject
        .call(g => g.select('.domain').remove())
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .attr('font-weight', 'bold')
        .attr('y',25)
        .attr('x',-50)
        .text(label);
    }
}

const pieChartMaker = (data, parentId, dataColor)=>{
    const svg = d3.select(`#${parentId}`)
    const height = svg.attr('height')
    const width = svg.attr('width')


    var pieGenerator = d3.pie()
                .startAngle(-0.5 * Math.PI)
                .endAngle(0.5 * Math.PI);

    var data = [data, 100 - data];
    var arcData = pieGenerator(data);

    var arcGenerator = d3.arc()
        .innerRadius(width / 4)
        .outerRadius(width / 2);

    svg.append('g')
        .attr('transform',`translate(100,100)`)
        .selectAll('path')
        .data(arcData[0])
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill',dataColor);
}
const barPlot = (dataIn, svgIn, yRef, xRef, refColor) => {

    // console.log(dataIn)
    //get the values to placed on the charts
    const cleanDataIn = dataIn;
    // console.log(cleanDataIn)
    const xData = cleanDataIn.map(d => d[xRef]);
    const yData = cleanDataIn.map(d => d[yRef]);
    // console.log(xData, d3.max(yData), yTarget);
    // const shrinkedY = yData.map(d =>d.includes('Women')? 
    //                     d.replace('Women','W') 
    //                     :d.replace('Men','M'))
    // console.log(shrinkedY)
    const numberFormat = d3.format(".2s");

    const svg = d3.select(`#${svgIn}`);
    svg.selectAll('*').remove()

    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { left: 30, right: 40, top: 10, bottom: 30 };

    const visHeight = height - margin.top - margin.bottom;
    const visWidth = width - margin.right - margin.left;

    const chart = svg.append('g')
        .attr('transform', `translate(${0}, ${margin.top})`);

    const yScale = d3.scaleBand()
        .domain(yData)
        .range([visHeight, margin.top])
        .paddingInner(0.2);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(xData)])
        .range([margin.left, visWidth + 35])
        .clamp(true);

    // const tgtScale = d3.scaleLinear()
    //     .domain([0, d3.max(yTarget)])
    //     .range([visHeight,margin.top])
    const yAxis = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.1em")
        .attr("dy", ".05em")
        .attr("transform", "rotate(-25)");

    // const yTgtAxis = svg.append('g')
    //     .attr('transform',`translate(${visWidth + margin.right},${margin.top})`)
    //     .call(d3.axisRight(tgtScale)
    //             .ticks(6, "$.2s"))
    const xAxis = svg.append('g')
        .attr('transform', `translate(${0},${visHeight + margin.top})`)
        .call(d3.axisBottom(xScale)
                .ticks(7, "$.2s"))
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.1em")
        .attr("dy", ".05em")
        .attr("transform", "rotate(-25)");

    axesDomain('x', xAxis, xRef, visWidth, visHeight);
    axesDomain('y', yAxis, yRef, visWidth, visHeight);
    // axesDomain('y',yTgtAxis,'Target',visWidth,visHeight)
    const bubbles = chart.selectAll('g')
        .data(cleanDataIn)
        .join('g');

    const bars = bubbles
        .append('rect')
        .attr('x',xScale(0))
        .attr('y', d => yScale(d[yRef]))
        .attr('height', yScale.bandwidth())
        .attr('width', d => xScale(d[xRef]) - margin.left)
        .attr('class', 'ref')
        .attr('fill', refColor)
        .attr('opacity', 0.7);

    const valuesRef = bubbles
        .append('text')
        .attr('x', d => xScale(d[xRef]))
        .attr('y', d => yScale(d[yRef]) + yScale.bandwidth())
        .text(d => `${numberFormat(d[xRef])}`)
        .attr('fill', refColor)
        .attr('font-size', '15');

}

const linePlot = (dataIn, svgIn, xRef, yRef, refColor) => {
    // console.log(dataIn)
    //get the values to placed on the charts
    const cleanDataIn = dataIn;
    // console.log(cleanDataIn)
    const xData = cleanDataIn.map(d => d[xRef]);
    const yData = cleanDataIn.map(d => d[yRef]);

    const numberFormat = d3.format(".2s");

    const svg = d3.select(`#${svgIn}`);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { left: 50, right: 25, top: 25, bottom: 40 };

    const visHeight = height - margin.top - margin.bottom;
    const visWidth = width - margin.right - margin.left;
    svg.selectAll('*').remove()
    const chart = svg.append('g')
        .attr('transform', `translate(${0}, ${margin.top})`);

    const xScale = d3.scalePoint()
        .domain(xData)
        .range([margin.left, visWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yData)])
        .range([visHeight, margin.top])
        .clamp(true);

    const yAxis = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale)
            .ticks(7, "$.2s"));

    const xAxis = svg.append('g')
        .attr('transform', `translate(${0},${visHeight + margin.top})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.1em")
        .attr("dy", ".05em")
        .attr("transform", "rotate(-25)");

    axesDomain('x', xAxis, xRef, visWidth, visHeight);
    axesDomain('y', yAxis, yRef, visWidth, visHeight);
    // axesDomain('y',yTgtAxis,'Target',visWidth,visHeight)
    const bubbles = chart.selectAll('g')
        .data(cleanDataIn)
        .join('g');

    const linePath =  d3.line()
            .curve(d3.curveCardinal)
            .x(d => xScale(d[xRef]))
            .y(d => yScale(d[yRef]))

    const linesGroup = chart.append('g');
    
    linesGroup.append('path')
        .attr('d', linePath(cleanDataIn))
        .attr('fill','none')
        .attr('stroke-width',2)
        .attr('stroke', refColor)

    const valuesRef = bubbles
        .append('text')
        .attr('x', d => xScale(d[xRef]))
        .attr('y', d => yScale(d[yRef]))
        .text(d => `${numberFormat(d[yRef])}`)
        .attr('fill', refColor)
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
        .attr('y',-2)
        .attr('x',-30)
        .text(label);
    }
}

const pieChartMaker = (data, parentId)=>{
    const svg = d3.select(`#${parentId}`)
    const height = svg.attr('height')
    const width = svg.attr('width')


    var pieGenerator = d3.pie()
                .startAngle(0.5 * Math.PI)
                .endAngle(-0.5 * Math.PI);

    var data = [100 - data, data];
    var arcData = pieGenerator(data);

    var fillScale = d3.scaleOrdinal()
        .range(['purple', "orange"])

    var arcGenerator = d3.arc()
        .innerRadius(width / 4)
        .outerRadius(width / 2);
    // console.log(arcData)
    svg.append('g')
        .attr('transform',`translate(75,100)`)
        .selectAll('path')
        .data(arcData)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill',(d,i) => fillScale(i));
}
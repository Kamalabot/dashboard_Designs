const scatterPlot = function(dataIn,svgIn, xRef,yRef){
    // console.log(dataIn)
    //get the values to placed on the charts
    const cleanDataIn = dataIn.filter(d => d.Products != 'Total')

    const xData = cleanDataIn.map(d => d[xRef]);
    const yData = cleanDataIn.map(d => d[yRef]);
    console.log(xData, yData)
    const numberFormat = d3.format(".2s")

    const svg = d3.select(`#${svgIn}`)
    const width = svg.attr('width')
    const height = svg.attr('height')
    const margin = {left:50, right:25, top:25, bottom:20}

    const visHeight = height - margin.top - margin.bottom;
    const visWidth = width - margin.right - margin.left;

    const chart = svg.append('g')
        .attr('transform',`translate(${margin.top}, ${margin.left})`)

    const xScale = d3.scaleBand()
        .domain(xData)
        .range([0,visWidth])

    const yScale = d3.scaleLinear()
        .domain([0,d3.max(yData)])
        .range([visHeight,0])

    const yAxis = svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale)
                .ticks(6, "$.2s"))
        .call(g => g.select('.domain').remove())
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .attr('font-weight', 'bold')
        .attr('y', -margin.top + 5)
        .attr('x', -margin.left)
        .text("Revenue");
    
    

    const xAxis = svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top + visHeight})`)
        .call(d3.axisBottom(xScale))

}

function axesDomain(axis, axisObject, label,format, visWidth, visHeight){
    if (axis == 'x' || axis == 'X'){
    axisObject
    .call(g => g.select('.domain').remove())
    .append('text')
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'hanging')
    .attr('font-weight', 'bold')
    .attr('y', margin.bottom + 5)
    .attr('x', visWidth/2)
    .text(label);
    } else if (axis == 'y' || axis == 'Y'){
        axisObject
        .call(g => g.select('.domain').remove())
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .attr('font-weight', 'bold')
        .attr('y', -margin.top + 5)
        .attr('x', -margin.left)
        .text(label);
    }
}


const buildCompositeChart = function(dataIn, svgIn){
    console.log(dataIn)
    
}
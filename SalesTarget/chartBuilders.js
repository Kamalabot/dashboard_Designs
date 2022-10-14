const buildGroupedBar = function (dataIn, svgIn){
    // console.log(dataIn)

    //setting up the chart
    const svg = d3.select(`#${svgIn}`)
    
    const height = svg.attr('height');
    const width = svg.attr('width');

    const margin = {top: 30, right: 50, bottom: 20, left:50};
    
    const visWidth = width - margin.left - margin.right;
    const visHeight = height - margin.top - margin.bottom;
    
    //setting up the inputs
    const months = dataIn.map(d => d.months)
    const targets = dataIn.map(d => d.Target)
    const revenue = dataIn.map(d => d.Revenue)
    
    // this scale will be used to position the groups for each month
    const color = d3.scaleOrdinal()
        .domain(months)
        .range(d3.schemeTableau10)

    const colorValue = d3.scaleOrdinal()
        .domain(['Target','Revenue'])
        .range(d3.schemeTableau10)

    const group = d3.scaleBand()
        .domain(months)
        .range([0, visWidth])
        .padding(0.2);
    
    const targetsY = d3.scaleLinear()
        .domain([0, d3.max(targets)]).nice()
        .range([visHeight, 0]);

    const revenueY = d3.scaleLinear()
        .domain([0, d3.max(revenue)]).nice()
        .range([visHeight, 0]);
    
    // this scale will be used to position the bars within a group
    const x = d3.scaleBand()
        .domain(['Target','Revenue'])
        .range([0, group.bandwidth()])
    
    //Building the Chart  
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
        // set up the axes
    
    const xAxis = d3.axisBottom(group);
    
    const yAxisRight = d3.axisRight(targetsY);

    const yAxisLeft = d3.axisLeft(revenueY);
    
    g.append('g')
        .attr('transform', `translate(0,${visHeight})`)
        .call(xAxis)
        .call(g => g.selectAll('.domain').remove());
    
    g.append("g")
    .attr('transform',`translate(0,0)`)
        .call(yAxisLeft)
        .call(g => g.selectAll('.domain').remove())
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .attr('font-weight', 'bold')
        .attr('y', -margin.top + 5)
        .attr('x', -margin.left)
        .text('Revenue Achieved')

    g.append("g")
        .attr('transform',`translate(${310},${0})`)
        .call(yAxisRight)
        .call(g => g.selectAll('.domain').remove())
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .attr('font-weight', 'bold')
        .attr('y', -margin.top + 5)
        .attr('x', 5)
        .text('Target!!!')
    
    // create and position one group for each month
    const groups = g.append('g')
        .selectAll('g')
        .data(dataIn)
        .join('g')
        .attr('transform', d => `translate(${group(d.months)},0)`);
    var bandwidth = x.bandwidth()
    groups.append('rect')
        .attr('fill', 'purple')
        .attr('opacity',0.85)
        .attr('y', d => revenueY(d.Revenue))
        .attr('height', d => visHeight - revenueY(d.Revenue))
        .attr('x', d => x('Revenue'))
        .attr('width', x.bandwidth());
    
    groups.append('rect')
        .attr('fill', 'orange')
        .attr('opacity',0.85)
        .attr('y', d => targetsY(d.Target))
        .attr('height', d => visHeight - targetsY(d.Target))
        .attr('x', d => x('Target'))
        .attr('width', x.bandwidth());
    return svg.node();

}

const buildStackedBar = function (dataIn, svgIn){
    //setting up the inputs
    const months = dataIn.map(d => d.months)
    const targets = dataIn.map(d => d.Target)
    const revenue = dataIn.map(d => d.Revenue)
    
    const varibles = ['Target','Revenue'];

    const stackData = d3.stack().keys(varibles)(dataIn)
    // console.log(stackData)

    const yMax = dataIn.map(d => d.Target + d.Revenue)
    console.log(d3.max(yMax))
    //setting up the chart
    const svg = d3.select(`#${svgIn}`)
    
    const height = svg.attr('height');
    const width = svg.attr('width');

    const margin = {top: 30, right: 50, bottom: 20, left:50};
    
    const visWidth = width - margin.left - margin.right;
    const visHeight = height - margin.top - margin.bottom;


    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    var x = d3.scaleBand()
        .domain(months)
        .range([0, visWidth])
        .padding(0.25)
    
    var y = d3.scaleLinear()
        .domain([0, d3.max(yMax)]).nice()
        .range([visHeight,0]);

    var color = d3.scaleOrdinal()
        .domain(stackData.map(d => d.key))
        .range(['purple','orange'])
    
    const xAxis = d3.axisBottom(x)
    
    const yAxis = d3.axisLeft(y)
    
    g.append('g')
        .attr('transform', `translate(0,${visHeight})`)
        .call(xAxis)
        .call(g => g.select('.domain').remove());
    
    g.append("g")
        .call(yAxis)
        .call(g => g.select('.domain').remove())
        .append('text')
        .attr('fill', 'black')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'hanging')
        .attr('font-weight', 'bold')
        .attr('y', -margin.top + 5)
        .attr('x', -margin.left)
        .text("No of Customers acquired");
    
    const series = g.append('g')
        .selectAll('g')
        .data(stackData)
        .join('g')
        .attr('fill', d => color(d.key))
        .attr('opacity',0.85);
    
    series.selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('x', d => x(d.data.months))
        .attr('width', x.bandwidth());
    
    return svg.node();

}

const buildCompositeChart = function(dataIn, svgIn){
    console.log(dataIn)
    
}

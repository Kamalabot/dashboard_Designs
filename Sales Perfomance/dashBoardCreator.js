const dataAquisition = async ()=>{
    const salesPerformance = await d3.csv('salesPerformanceDashboard.csv')
    // console.log(salesPerformance)
    // console.log(customerAcquisition)
    
    //Parsing and cleaning Data
    const parseDate = d3.timeParse("%d-%m-%Y");
    
    const numberFormat = d3.format(".2s")

    var monthNames= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

    const cleanSalePerfData = salesPerformance.map(d=>({
        cogs: Number(d.COGS),
        category: d.Category,
        cost: Number(d.Cost),
        customerName: d['Customer Name'],
        gender: d.Gender,
        grossProfit: Number(d['Gross Profit']),
        price: Number(d.Price),
        product: d.Product,
        qty: Number(d.Qty),
        dateSold: parseDate(d['Sales Date']),
        saleId:d['Sales ID'],
        reps: d['Sales Reps'],
        stores:d.Stores,
        totalSales: Number(d['Total Sales']),
        txnType: d['Trans.Types'],
        weekDays:d['Week days'],
        month: monthNames[parseDate(d['Sales Date']).getMonth()]
    }))

    console.log(cleanSalePerfData)
    // Aggregate data points
    var totQtySold, totSales, totCogs, totProfit, totCustomers, totTransaction, totProducts, totStores;

    totQtySold = sumSeries(cleanSalePerfData,'qty')
    totSales= sumSeries(cleanSalePerfData,'totalSales')
    totCogs= sumSeries(cleanSalePerfData,'cogs')
    totProfit= sumSeries(cleanSalePerfData,'grossProfit')
    totTransaction= cleanSalePerfData.length,

    //Grouping based on customers
    totCustomers= d3.rollups(cleanSalePerfData,v => v.length, d => d.customerName).length;
    totProducts= d3.rollups(cleanSalePerfData,v => v.length, d => d.product).length;
    totStores= d3.rollups(cleanSalePerfData,v => v.length,d => d.stores).length;
    totReps = d3.rollups(cleanSalePerfData,v => v.length,d => d.reps).length;

    // console.log(totQtySold, totSales, totCogs, totProfit, totCustomers, totTransaction, totProducts, totStores)

    var products= d3.rollups(cleanSalePerfData,v => v.length, d => d.product).map(d => ({
        product: d[0],
        count: d[1]
    }));
    var stores= d3.rollups(cleanSalePerfData,v => v.length,d => d.stores).map(d => d[0]);
    var reps = d3.rollups(cleanSalePerfData,v => v.length,d => d.reps).map(d => d[0]);
    // console.log(reps)
    var months = [... new Set(cleanSalePerfData.map(d => d.dateSold.toLocaleString('default', { month: 'long' })))]
    // console.log(months)


    dataSentId(numberFormat(totQtySold),"qty")
    dataSentId(numberFormat(totSales),"sales")
    dataSentId(numberFormat(totCogs),"cost")
    dataSentId(numberFormat(totProfit),"profit")
    dataSentId(numberFormat(totCustomers),"cust")
    dataSentId(numberFormat(totProducts),"pdt")
    dataSentId(numberFormat(totStores),"str")
    dataSentId(numberFormat(totTransaction),"txn")

    categoryView = d3.rollups(cleanSalePerfData, v => d3.sum(v, f => f.totalSales), d => d.category)
    categoryContri = categoryView.map(d => ({
        category: d[0],
        contribution :(d[1] / totSales ) * 100
    })).sort((a,b) => d3.descending(a.contribution, b.contribution)) 
    // console.log(categoryContri)
    //populating the categories
    let i = 0;
    for(let cat of categoryContri){
        // console.log(`contri${i + 1}`)
        dataSentId(categoryContri[i].category, `contri${i + 1}`)
        dataSentId(categoryContri[i].contribution.toFixed(1), `cat${i + 1}`)
        pieChartMaker(categoryContri[i].contribution,`pie${i + 1}`)
        i += 1;
    }
    //populating the product analysis columns
    let domId = document.getElementById("months")
    var idx = 0;
    for(let elt of months){
        //Adding months string to page
        let htmlFrag = `<a class="link dim black f3 dib mr5 tc" href="#" id="months_${idx}" title="Link ${idx + 1}">${elt}</a>`
        domId.innerHTML += htmlFrag;
        //Adding Event listener to each month link
        eventListenerAdd(cleanSalePerfData,`months_${idx}`, "month", `${elt}`)
        idx += 1;
    }

    populateNav(cleanSalePerfData, stores,'stores')
    populateNav(cleanSalePerfData, reps,'reps')

    //Working on providing the event listeners to create explorations
    eventListenerAdd(cleanSalePerfData,"months_0", "month", months[0])
    eventListenerAdd(cleanSalePerfData,"months_1", "month", months[1])
    eventListenerAdd(cleanSalePerfData,"months_2", "month", months[2])
    eventListenerAdd(cleanSalePerfData,"months_3", "month", months[3])

    eventListenerAdd(cleanSalePerfData,"stores_0", "stores", stores[0])
    eventListenerAdd(cleanSalePerfData,"stores_1", "stores", stores[1])
    eventListenerAdd(cleanSalePerfData,"stores_2", "stores", stores[2])
    eventListenerAdd(cleanSalePerfData,"stores_3", "stores", stores[3])

    eventListenerAdd(cleanSalePerfData,"reps_0", "reps", reps[0])
    eventListenerAdd(cleanSalePerfData,"reps_1", "reps", reps[1])
    eventListenerAdd(cleanSalePerfData,"reps_2", "reps", reps[2])
    eventListenerAdd(cleanSalePerfData,"reps_3", "reps", reps[3])

    eventListenerAdd(cleanSalePerfData,"gender_0", "gender", 'Male')
    eventListenerAdd(cleanSalePerfData,"gender_1", "gender", 'Female')

    // console.log(filterPerformance(cleanSalePerfData,'month','July'))
    barPlot(products, 'chart1', 'product', 'count', 'orange')

}   

function groupingSum(dataset, category, reqdSum){
    var result = d3.rollups(dataset,v => d3.sum(v, f => f[reqdSum]), d => d[category]).map(d => ({
        category: d[0],
        value :d[1]
    })).sort((a,b) => d3.descending(a.value, b.value))
    return result
}

function filterPerformance(dataset, filterCat, filterValue){
    let filterData = dataset.filter(d => d[filterCat] == filterValue)
    let consolidateData =[];
    let performanceMetrics = ['totalSales', 'grossProfit','cogs'];
    for( let perf of performanceMetrics){
        let makeReply = {feature: perf, data: sumSeries(filterData,perf)}
        consolidateData.push(makeReply)
    }
    var reply = {
        totSales:sumSeries(filterData,'totalSales'),
        grossProfit:sumSeries(filterData,'grossProfit'),
        cogs:sumSeries(filterData,'cogs'),
        qty: sumSeries(filterData,'qty')
    }
    
    barPlot(consolidateData,'chart1', 'feature','data','orange')
    // return consolidateData
}

function sumSeries(dataset, series){
    let sum = d3.sum(dataset, d => d[series])
    return sum
}

function dataSentId(value, id){
    let elt = document.getElementById(id)
    elt.textContent = value
}

function populateNav(mainDataSet,arrayList, id){
    let domId = document.getElementById(id)
    var idx = 0;
    for(let elt of arrayList){
        let htmlFrag = `<a class="link dim black f3 dib mr3" href="#" id="${id}_${idx}" title="Link ${idx + 1}">${elt}</a>`
        domId.innerHTML += htmlFrag;
        //Adding Event listener to each link and initiating the values which it will filter
        idx += 1;
    } 
}

function eventListenerAdd(maindataset, id, filterCat, filterValue){
    console.log(`Entering from ${id} with ${filterCat} and ${filterValue}`)
    let eleId = document.getElementById(id)
    eleId.addEventListener('click',()=>{
        console.log(`Entering from ${id} with ${filterCat} and ${filterValue}`)
        //maindataset is the data that hte filter will work on. filterCat is the category in the data
        let filteredData = filterPerformance(maindataset, filterCat, filterValue)
        console.log(filteredData)
    })

}

dataAquisition()
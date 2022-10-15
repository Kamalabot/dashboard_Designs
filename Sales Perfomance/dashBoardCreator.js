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
        genter: d.Gender,
        grossProfit: Number(d['Gross Profit']),
        price: Number(d.Price),
        product: d.Product,
        qty: Number(d.Qty),
        dateSold: parseDate(d['Sales Date']),
        saleId:d['Sales ID'],
        salesRep: d['Sales Reps'],
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
    totReps = d3.rollups(cleanSalePerfData,v => v.length,d => d.salesRep).length;

    // console.log(totQtySold, totSales, totCogs, totProfit, totCustomers, totTransaction, totProducts, totStores)

    var products= d3.rollups(cleanSalePerfData,v => v.length, d => d.product).map(d => ({
        product: d[0],
        count: d[1]
    }));
    var stores= d3.rollups(cleanSalePerfData,v => v.length,d => d.stores).map(d => d[0]);
    var reps = d3.rollups(cleanSalePerfData,v => v.length,d => d.salesRep).map(d => d[0]);
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
    var id = 0;
    for(let elt of months){
        let htmlFrag = `<a class="link dim black f3 dib mr5 tc" href="#" title="Link ${id + 1}">${elt}</a>`
        domId.innerHTML += htmlFrag;
        id += 1;
    }
    populateNav(stores,'stores')
    populateNav(reps,'reps')

    //Working on the charts
    console.log(filterPerformance(cleanSalePerfData,'month','July'))
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
    var reply = {
        totSales:sumSeries(filterData,'totalSales'),
        grossProfit:sumSeries(filterData,'grossProfit'),
        cogs:sumSeries(filterData,'cogs'),
        qty: sumSeries(filterData,'qty')
    }
    return reply
}

function sumSeries(dataset, series){
    let sum = d3.sum(dataset, d => d[series])
    return sum
}

function dataSentId(value, id){
    let elt = document.getElementById(id)
    elt.textContent = value
}

function populateNav(arrayList, id){
    let domId = document.getElementById(id)
    var id = 0;
    for(let elt of arrayList){
        let htmlFrag = `<a class="link dim black f3 dib mr3" href="#" title="Link ${id + 1}">${elt}</a>`
        domId.innerHTML += htmlFrag;
        id += 1;
    } 
}

dataAquisition()
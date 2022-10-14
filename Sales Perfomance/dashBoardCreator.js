const dataAquisition = async ()=>{
    const salesPerformance = await d3.csv('salesPerformanceDashboard.csv')
    // console.log(salesPerformance)
    // console.log(customerAcquisition)
    
    //Parsing and cleaning Data
    const parseDate = d3.timeParse("%d-%m-%Y");
    const numberFormat = d3.format(".2s")

    const cleanSalePerfData = salesPerformance.map(d=>({
        cogs: Number(d.COGS),
        category: d.Category,
        cost: Number(d.Cost),
        customerName: d['Customer Name'],
        genter: d.Gender,
        grossProfit: d['Gross Profit'],
        price: Number(d.Price),
        product: d.Product,
        qty: Number(d.Qty),
        dateSold: parseDate(d['Sales Date']),
        saleId:d['Sales ID'],
        salesRep: d['Sales Reps'],
        stores:d.Stores,
        totalSales: d['Total Sales'],
        txnType: d['Trans.Types'],
        weekDays:d['Week days']
    }))

    // console.log(cleanSalePerfData)
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
    console.log(categoryContri)
    //populating the categories
    let i = 0;
    for(let cat of categoryContri){
        console.log(`contri${i + 1}`)
        dataSentId(categoryContri[i].category, `contri${i + 1}`)
        dataSentId(categoryContri[i].contribution.toFixed(1), `cat${i + 1}`)
        pieChartMaker(categoryContri[i].contribution,`pie${i + 1}`)
        i += 1;
    }
    //populating the values

}   

function sumSeries(dataset, series){
    let sum = d3.sum(dataset, d => d[series])
    return sum
}

function dataSentId(value, id){
    let elt = document.getElementById(id)
    elt.textContent = value
}

dataAquisition()
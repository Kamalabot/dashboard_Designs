const dataAquisition = async ()=>{
    const salesPerformance = await d3.csv('salesPerformanceDashboard.csv')
    console.log(salesPerformance)
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
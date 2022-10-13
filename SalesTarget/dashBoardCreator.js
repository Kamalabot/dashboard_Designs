const dataAquisition = async ()=>{
    const salesTarget = await d3.csv('salesTarget.csv')
    const productsTarget = await d3.csv('productsTarget.csv')
    const monthlyTargets = await d3.csv('monthlyTargets.csv')
    const customerAcquisition = await d3.csv('customerAcquisition.csv')
    const adsProcurement = await d3.csv('adsProcurement.csv')
    // console.log(adsProcurement)
    // console.log(customerAcquisition)
    
    //Parsing and cleaning Data
    const parseDate = d3.timeParse("%B %d, %Y");

    const cleanSalesData = salesTarget.map(d =>({
        date : parseDate(d.Date),
        product: d["Prod..s"].replace(' ','').replace('.','_'),
        revenue:+d.Revenue.replace('$','').replace(',','')
    }))
    const cleanAdsData = adsProcurement.map(d =>({
        date : parseDate(d.Date),
        adsExpense:+d['Ads Expenses'].replace('$','').replace(',','')
    }))
    const cleanCustomerAcqData = customerAcquisition.map(d =>({
        date : parseDate(d.f),
        cstAcqrd: +d["New Customer"]
        
    }))
    //getting total 
    const totalSales = d3.sum(cleanSalesData, d => d.revenue)
    const totaladsExp = d3.sum(cleanAdsData, d => d.adsExpense)
    const totalCstAqrd = d3.sum(cleanCustomerAcqData, d => d.cstAcqrd)
    //checking the totals then sending data to DOM
    // console.log(totalCstAqrd,totalSales,totaladsExp)
    dataSentId(totalSales,'revenueAch')
    dataSentId(totalCstAqrd,'customerAch')

    const monthlySalesTgt = monthlyTargets.filter(d => d.Activity == 'Sales Target').map(d => ({
        months: d.months,
        Target: +d.Target,
        Revenue: +d.Revenue
    }))
    const monthlyCustTgt = monthlyTargets.filter(d => d.Activity == 'Customer Acquisition').map(d => ({
        months: d.months,
        Target: +d.Target,
        Revenue: +d.Revenue
    }))
    const monthlyAdsTgt = monthlyTargets.filter(d => d.Activity == 'Ads Budget and expenses').map(d => ({
        months: d.months,
        Target: +d.Target,
        Revenue: +d.Revenue
    }))

    const cleanProductsTarget = productsTarget.map(d => ({
        Products: d.Products.replace(' ','').replace('.','_'),
        Target: +d.Target,
        Revenue: +d.Revenue
    }))

    const totalSalesTgt = d3.sum(monthlySalesTgt, d => d.Target)
    const totaladsExpTgt = d3.sum(monthlyCustTgt, d => d.Target)
    const totalCstAqrdTgt = d3.sum(monthlyAdsTgt, d => d.Target)

    dataSentId(totalSalesTgt,'revenueTgt')
    dataSentId(totalCstAqrdTgt,'customerTgt')

    const salesAchievement = (totalSales / totalSalesTgt) * 100;
    const acquisitionAchievement = (totalCstAqrd / totalCstAqrdTgt) * 100;
    const adsExpenseAchievement = (totaladsExp / totaladsExpTgt) * 100

    dataSentId(`${salesAchievement.toFixed(1)}%`,'achvRevn')
    dataSentId(`${acquisitionAchievement.toFixed(1)}%`,'achvCust')

    buildGroupedBar(monthlySalesTgt, 'asset1Chart')
    buildStackedBar(monthlyCustTgt,'asset2Chart')

    console.log(cleanProductsTarget)

}

function dataSentId(value, id){
    let elt = document.getElementById(id)
    elt.textContent = value
}

const buildGroupedBar = function (dataIn, svgIn){
    console.log(dataIn)
}


const buildStackedBar = function (dataIn, svgIn){
    console.log(dataIn)
}

const buildScatterPlot = function(dataIn, svgIn){
    console.log(dataIn)
}


dataAquisition()
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
    const numberFormat = d3.format(".2s")

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
    const totalCstAqrd = d3.sum(cleanCustomerAcqData, d => d.cstAcqrd)
    //checking the totals then sending data to DOM
    // console.log(totalCstAqrd,totalSales,totaladsExp)
    dataSentId(numberFormat(totalSales),'revenueAch')
    dataSentId(numberFormat(totalCstAqrd),'customerAch')

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
        Budget: +d.Target,
        Expense: +d.Revenue
    }))
    console.log(monthlyAdsTgt)
    const cleanProductsTarget = productsTarget.map(d => ({
        Products: d.Products.replace(' ','').replace('.','_'),
        Target: +d.Target,
        Revenue: +d.Revenue
    }))

    const totalSalesTgt = d3.sum(monthlySalesTgt, d => d.Target)

    const totaladsExpTgt = d3.sum(monthlyAdsTgt, d => d.Budget)
    const totaladsExp = d3.sum(monthlyAdsTgt, d => d.Expense)

    const totalCstAqrdTgt = d3.sum(monthlyCustTgt, d => d.Target)
    
    const totalProductTgt = d3.sum(cleanProductsTarget, d => d.Target)
    const totalProductRev = d3.sum(cleanProductsTarget, d => d.Revenue)
    // console.log(numberFormat(totalSalesTgt))
    dataSentId(numberFormat(totalProductTgt),'pdtTgt')
    dataSentId(numberFormat(totalProductRev),'pdtAch')
    dataSentId(numberFormat(totaladsExp),'adsAch')

    dataSentId(numberFormat(totalSalesTgt),'revenueTgt')
    dataSentId(numberFormat(totalCstAqrdTgt),'customerTgt')
    dataSentId(numberFormat(totaladsExpTgt),'adsTgt')

    const salesAchievement = (totalSales / totalSalesTgt) * 100;
    const acquisitionAchievement = (totalCstAqrd / totalCstAqrdTgt) * 100;
    const adsExpenseAchievement = (totaladsExp / totaladsExpTgt) * 100
    const productWiseAchievement = (totalProductRev / totalProductTgt) * 100;
    dataSentId(`Achieved ${salesAchievement.toFixed(1)}%`,'achvRevn')
    dataSentId(`Achieved ${acquisitionAchievement.toFixed(1)}%`,'achvCust')
    dataSentId(`Achieved ${productWiseAchievement.toFixed(1)}%`,'achvPdt')
    dataSentId(`Consumed ${adsExpenseAchievement.toFixed(1)}%`,'achvAds')

    buildGroupedBar(monthlySalesTgt, 'asset1Chart')
    buildStackedBar(monthlyCustTgt,'asset2Chart')
    scatterPlot(cleanProductsTarget,'asset3Chart','Products','Revenue','Target','purple','orange')
    // buildCompositeChart(cleanProductsTarget,'asset3Chart')
    // buildCompositeChart(adsExpenseAchievement,'asset4Chart')
    lineBarPlot(monthlyAdsTgt,'asset4Chart','months','Expense','Budget','purple','orange')
    // console.log(cleanProductsTarget)

}   

function dataSentId(value, id){
    let elt = document.getElementById(id)
    elt.textContent = value
}

dataAquisition()